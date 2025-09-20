import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Play, Pause, RotateCcw, Download, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { poseAnalyzer, type AnalysisResult } from '@/utils/poseAnalyzer';
import PoseVisualizer from './PoseVisualizer';
import AnalysisMetrics from './AnalysisMetrics';

export default function VideoAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [useWebcam, setUseWebcam] = useState(false);
  const [frameRate] = useState(30); // Increased frame rate for smoother tracking
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();
  const playbackSyncRef = useRef<number>();

  useEffect(() => {
    initializePoseAnalyzer();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (playbackSyncRef.current) {
        cancelAnimationFrame(playbackSyncRef.current);
      }
    };
  }, []);

  // Sync currentFrame with video playback for real-time pose display
  useEffect(() => {
    const video = videoRef.current;
    if (!video || analysisResults.length === 0) return;

    const syncFrameWithVideo = () => {
      if (video && !video.paused && !video.ended) {
        const videoTime = video.currentTime;
        const frameIndex = Math.floor(videoTime * frameRate);
        const clampedFrame = Math.min(frameIndex, analysisResults.length - 1);
        setCurrentFrame(clampedFrame);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
      playbackSyncRef.current = requestAnimationFrame(syncFrameWithVideo);
    };

    if (analysisResults.length > 0) {
      syncFrameWithVideo();
    }

    return () => {
      if (playbackSyncRef.current) {
        cancelAnimationFrame(playbackSyncRef.current);
      }
    };
  }, [analysisResults, frameRate]);

  const initializePoseAnalyzer = async () => {
    try {
      await poseAnalyzer.initialize();
      toast({
        title: "AI Model Ready",
        description: "Pose detection model loaded successfully!"
      });
    } catch (error) {
      console.error('Failed to initialize pose analyzer:', error);
      toast({
        title: "Model Loading Failed",
        description: "Please refresh and try again.",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      if (videoRef.current) {
        videoRef.current.src = url;
        videoRef.current.load();
      }
      setUseWebcam(false);
      setAnalysisResults([]);
      setCurrentFrame(0);
      toast({
        title: "Video Loaded",
        description: "Ready for AI analysis!"
      });
    }
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setUseWebcam(true);
      setVideoFile(null);
      setAnalysisResults([]);
      toast({
        title: "Webcam Active",
        description: "Ready for live analysis!"
      });
    } catch (error) {
      console.error('Error accessing webcam:', error);
      toast({
        title: "Webcam Error",
        description: "Please allow camera access.",
        variant: "destructive"
      });
    }
  };

  const analyzeVideo = async () => {
    if (!videoRef.current) return;
    
    setIsAnalyzing(true);
    setProgress(0);
    const results: AnalysisResult[] = [];
    
    try {
      const video = videoRef.current;
      const duration = useWebcam ? 10 : video.duration; // 10 seconds for webcam
      const frameRate = 10; // Analyze 10 frames per second
      const totalFrames = Math.floor(duration * frameRate);
      
      if (useWebcam) {
        // Live analysis
        let frameCount = 0;
        const analyzeFrame = async () => {
          if (frameCount >= totalFrames || !isAnalyzing) {
            setIsAnalyzing(false);
            return;
          }
          
          try {
            const result = await poseAnalyzer.analyzeFrame(video, frameCount);
            results.push(result);
            setAnalysisResults([...results]);
            setProgress((frameCount / totalFrames) * 100);
            frameCount++;
            
            animationRef.current = requestAnimationFrame(analyzeFrame);
          } catch (error) {
            console.error('Frame analysis error:', error);
          }
        };
        
        analyzeFrame();
      } else {
        // Video file analysis with improved frame sampling
        const analysisFrameRate = Math.min(frameRate, 15); // Cap at 15fps for analysis
        const analysisFrames = Math.floor(duration * analysisFrameRate);
        
        for (let i = 0; i < analysisFrames; i++) {
          const time = (i / analysisFrameRate);
          video.currentTime = time;
          
          await new Promise(resolve => {
            video.addEventListener('seeked', resolve, { once: true });
          });
          
          try {
            const result = await poseAnalyzer.analyzeFrame(video, i);
            result.frame = Math.floor(time * frameRate); // Map to playback frame rate
            results.push(result);
            setProgress((i / analysisFrames) * 100);
            
            // Update UI every 5 frames for better responsiveness
            if (i % 5 === 0) {
              setAnalysisResults([...results]);
            }
          } catch (error) {
            console.error('Frame analysis error:', error);
          }
        }
        
        // Fill gaps for smoother playback
        const filledResults = fillFrameGaps(results, Math.floor(duration * frameRate));
        setAnalysisResults(filledResults);
      }
      
      setAnalysisResults(results);
      setProgress(100);
      
      toast({
        title: "Analysis Complete!",
        description: `Analyzed ${results.length} frames successfully.`
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Please try again with a different video.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResults([]);
    setCurrentFrame(0);
    setProgress(0);
    setIsPlaying(false);
    poseAnalyzer.reset();
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      if (useWebcam) {
        videoRef.current.srcObject = null;
      }
    }
    
    setUseWebcam(false);
    setVideoFile(null);
  };

  // Fill frame gaps for smoother playback
  const fillFrameGaps = (results: AnalysisResult[], totalFrames: number): AnalysisResult[] => {
    const filledResults: AnalysisResult[] = [];
    let resultIndex = 0;
    
    for (let frame = 0; frame < totalFrames; frame++) {
      if (resultIndex < results.length && results[resultIndex].frame === frame) {
        filledResults.push(results[resultIndex]);
        resultIndex++;
      } else {
        // Interpolate between nearby frames
        const prevResult = filledResults[filledResults.length - 1];
        const nextResult = results.find(r => r.frame > frame);
        
        if (prevResult) {
          // Use previous frame data for continuity
          filledResults.push({
            ...prevResult,
            frame,
            timestamp: Date.now()
          });
        } else if (nextResult) {
          // Use next frame data if no previous data
          filledResults.push({
            ...nextResult,
            frame,
            timestamp: Date.now()
          });
        }
      }
    }
    
    return filledResults;
  };

  return (
    <section id="analysis" className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI-Powered
            </span>{" "}
            Video Analysis
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload a video or use your webcam for real-time pose analysis, 
            performance metrics, and injury risk assessment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Video Upload/Webcam Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Video Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Video Display */}
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    controls={!useWebcam}
                    muted
                    playsInline
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />
                  
                  {/* Pose Overlay */}
                  {analysisResults.length > 0 && (
                    <PoseVisualizer
                      poses={analysisResults[currentFrame]?.poses || []}
                      canvasRef={canvasRef}
                      videoRef={videoRef}
                      showTrails={true}
                      isPlaying={isPlaying}
                    />
                  )}
                </div>

                {/* Controls */}
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1 min-w-[120px]"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video
                  </Button>
                  
                  <Button 
                    onClick={startWebcam}
                    variant="outline"
                    className="flex-1 min-w-[120px]"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Use Webcam
                  </Button>
                  
                  <Button 
                    onClick={resetAnalysis}
                    variant="outline"
                    size="icon"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                {/* Analysis Button */}
                <Button 
                  onClick={analyzeVideo}
                  disabled={(!videoFile && !useWebcam) || isAnalyzing}
                  className="w-full btn-hero"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Start AI Analysis
                    </>
                  )}
                </Button>

                {/* Progress */}
                {isAnalyzing && (
                  <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-muted-foreground text-center">
                      {Math.round(progress)}% Complete
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AnimatePresence>
              {analysisResults.length > 0 && (
                <AnalysisMetrics 
                  results={analysisResults}
                  currentFrame={currentFrame}
                  onFrameChange={setCurrentFrame}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}