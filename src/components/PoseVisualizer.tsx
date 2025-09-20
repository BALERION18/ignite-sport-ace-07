import { useEffect, useRef } from 'react';
import { type PoseData } from '@/utils/poseAnalyzer';

interface PoseVisualizerProps {
  poses: PoseData[];
  canvasRef: React.RefObject<HTMLCanvasElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
  showTrails?: boolean;
  isPlaying?: boolean;
}

const POSE_CONNECTIONS = [
  // Head
  ['nose', 'left_eye'],
  ['nose', 'right_eye'],
  ['left_eye', 'left_ear'],
  ['right_eye', 'right_ear'],
  
  // Torso
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['right_shoulder', 'right_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  
  // Legs
  ['left_hip', 'left_knee'],
  ['right_hip', 'right_knee'],
  ['left_knee', 'left_ankle'],
  ['right_knee', 'right_ankle'],
];

export default function PoseVisualizer({ 
  poses, 
  canvasRef, 
  videoRef, 
  showTrails = true,
  isPlaying = false 
}: PoseVisualizerProps) {
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const trailHistory = useRef<Array<{x: number, y: number, timestamp: number}>>([]);

  useEffect(() => {
    if (!poses.length || !videoRef.current || !overlayCanvasRef.current) return;

    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth || video.clientWidth;
    canvas.height = video.videoHeight || video.clientHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    poses.forEach((pose, poseIndex) => {
      drawPose(ctx, pose, poseIndex);
    });
  }, [poses, videoRef]);

  const drawPose = (ctx: CanvasRenderingContext2D, pose: PoseData, index: number) => {
    const keypoints = pose.keypoints;
    
    // Enhanced color scheme with better visibility
    const colors = ['#00FF88', '#FF6B6B', '#007BFF', '#FFD93D'];
    const color = colors[index % colors.length];

    // Draw movement trails for better motion visualization
    if (showTrails && isPlaying) {
      const centerKeypoints = ['left_hip', 'right_hip', 'left_shoulder', 'right_shoulder'];
      centerKeypoints.forEach(keypointName => {
        const keypoint = keypoints.find(kp => kp.name === keypointName);
        if (keypoint && keypoint.score && keypoint.score > 0.4) {
          trailHistory.current.push({
            x: keypoint.x,
            y: keypoint.y,
            timestamp: Date.now()
          });
        }
      });

      // Clean old trail points (keep last 2 seconds)
      const now = Date.now();
      trailHistory.current = trailHistory.current.filter(point => now - point.timestamp < 2000);

      // Draw trails
      if (trailHistory.current.length > 1) {
        ctx.strokeStyle = color + '40'; // Semi-transparent
        ctx.lineWidth = 2;
        ctx.beginPath();
        trailHistory.current.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      }
    }

    // Draw connections with dynamic thickness based on movement
    ctx.strokeStyle = color;
    ctx.lineWidth = isPlaying ? 4 : 3;
    ctx.lineCap = 'round';

    POSE_CONNECTIONS.forEach(([startName, endName]) => {
      const startPoint = keypoints.find(kp => kp.name === startName);
      const endPoint = keypoints.find(kp => kp.name === endName);

      if (startPoint && endPoint && 
          startPoint.score && startPoint.score > 0.3 && 
          endPoint.score && endPoint.score > 0.3) {
        
        // Add glow effect for better visibility
        ctx.shadowColor = color;
        ctx.shadowBlur = isPlaying ? 8 : 4;
        
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
      }
    });

    // Draw keypoints with enhanced visibility
    keypoints.forEach((keypoint) => {
      if (keypoint.score && keypoint.score > 0.3) {
        // Main keypoint
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, isPlaying ? 8 : 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add glow
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // White border for contrast
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Inner highlight
        ctx.fillStyle = '#FFFFFF40';
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, (isPlaying ? 8 : 6) * 0.4, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Enhanced confidence and movement display
    if (pose.score) {
      ctx.fillStyle = color;
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      
      const text = `Pose ${index + 1}: ${(pose.score * 100).toFixed(1)}%`;
      ctx.strokeText(text, 10, 30 + index * 22);
      ctx.fillText(text, 10, 30 + index * 22);
    }
  };

  return (
    <canvas
      ref={overlayCanvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{
        mixBlendMode: 'screen'
      }}
    />
  );
}