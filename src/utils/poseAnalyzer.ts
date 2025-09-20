// Simplified pose analyzer without external ML dependencies for demo
// import * as poseDetection from '@tensorflow-models/pose-detection';
// import '@tensorflow/tfjs-backend-webgl';

export interface PoseKeypoint {
  x: number;
  y: number;
  score?: number;
  name?: string;
}

export interface PoseData {
  keypoints: PoseKeypoint[];
  score?: number;
}

export interface AnalysisResult {
  poses: PoseData[];
  metrics: {
    speed: number;
    jumpHeight: number;
    cadence: number;
    agilityScore: number;
    injuryRisk: InjuryRisk;
  };
  frame: number;
  timestamp: number;
}

export interface InjuryRisk {
  overall: 'low' | 'medium' | 'high';
  areas: {
    knees: number;
    ankles: number;
    shoulders: number;
    back: number;
  };
}

class PoseAnalyzer {
  private detector: any | null = null;
  private previousPoses: PoseData[] = [];
  private frameHistory: AnalysisResult[] = [];
  private velocityHistory: Array<{x: number, y: number}> = [];
  
  async initialize() {
    try {
      // Mock initialization for demo
      this.detector = { initialized: true };
      console.log('Pose analyzer initialized (demo mode)');
    } catch (error) {
      console.error('Failed to initialize pose analyzer:', error);
      throw error;
    }
  }

  async analyzeFrame(
    video: HTMLVideoElement | HTMLImageElement,
    frameNumber: number = 0
  ): Promise<AnalysisResult> {
    if (!this.detector) {
      throw new Error('Pose detector not initialized');
    }

    try {
      // Generate mock pose data for demo
      const mockPoses = this.generateMockPoses();
      const timestamp = Date.now();
      
      // Calculate metrics
      const metrics = this.calculateMetrics(mockPoses, frameNumber);
      
      const result: AnalysisResult = {
        poses: mockPoses,
        metrics,
        frame: frameNumber,
        timestamp
      };

      // Store in history for velocity calculations
      this.frameHistory.push(result);
      if (this.frameHistory.length > 30) { // Keep last 30 frames
        this.frameHistory.shift();
      }

      this.previousPoses = mockPoses;
      return result;
    } catch (error) {
      console.error('Error analyzing frame:', error);
      throw error;
    }
  }

  private generateMockPoses(): PoseData[] {
    // Generate realistic mock pose data
    const baseY = 200 + Math.sin(Date.now() / 1000) * 20; // Simulate movement
    const baseX = 300;
    
    return [{
      keypoints: [
        { x: baseX, y: baseY - 100, score: 0.9, name: 'nose' },
        { x: baseX - 30, y: baseY - 50, score: 0.8, name: 'left_shoulder' },
        { x: baseX + 30, y: baseY - 50, score: 0.8, name: 'right_shoulder' },
        { x: baseX - 40, y: baseY + 20, score: 0.7, name: 'left_hip' },
        { x: baseX + 40, y: baseY + 20, score: 0.7, name: 'right_hip' },
        { x: baseX - 35, y: baseY + 100, score: 0.6, name: 'left_knee' },
        { x: baseX + 35, y: baseY + 100, score: 0.6, name: 'right_knee' },
        { x: baseX - 30, y: baseY + 180, score: 0.5, name: 'left_ankle' },
        { x: baseX + 30, y: baseY + 180, score: 0.5, name: 'right_ankle' },
      ],
      score: 0.85
    }];
  }

  private calculateMetrics(poses: PoseData[], frameNumber: number) {
    if (poses.length === 0) {
      return {
        speed: 0,
        jumpHeight: 0,
        cadence: 0,
        agilityScore: 0,
        injuryRisk: {
          overall: 'low' as const,
          areas: { knees: 0, ankles: 0, shoulders: 0, back: 0 }
        }
      };
    }

    const pose = poses[0]; // Use first detected pose
    const keypoints = pose.keypoints;

    // Calculate speed based on movement between frames
    const speed = this.calculateSpeed(keypoints);
    
    // Calculate jump height (vertical movement of hips)
    const jumpHeight = this.calculateJumpHeight(keypoints);
    
    // Calculate cadence (steps per minute)
    const cadence = this.calculateCadence(keypoints, frameNumber);
    
    // Calculate agility score based on pose stability and movement quality
    const agilityScore = this.calculateAgilityScore(keypoints);
    
    // Assess injury risk
    const injuryRisk = this.assessInjuryRisk(keypoints);

    return {
      speed,
      jumpHeight,
      cadence,
      agilityScore,
      injuryRisk
    };
  }

  private calculateSpeed(keypoints: PoseKeypoint[]): number {
    // Use multiple body points for more accurate speed calculation
    const leftHip = keypoints.find(kp => kp.name === 'left_hip');
    const rightHip = keypoints.find(kp => kp.name === 'right_hip');
    const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
    
    if (!leftHip || !rightHip || !leftShoulder || !rightShoulder) return 0;
    
    const currentCenter = {
      x: (leftHip.x + rightHip.x + leftShoulder.x + rightShoulder.x) / 4,
      y: (leftHip.y + rightHip.y + leftShoulder.y + rightShoulder.y) / 4
    };

    // Store velocity for smoothing
    if (this.previousPoses.length > 0) {
      const prevPose = this.previousPoses[0];
      const prevLeftHip = prevPose.keypoints.find(kp => kp.name === 'left_hip');
      const prevRightHip = prevPose.keypoints.find(kp => kp.name === 'right_hip');
      const prevLeftShoulder = prevPose.keypoints.find(kp => kp.name === 'left_shoulder');
      const prevRightShoulder = prevPose.keypoints.find(kp => kp.name === 'right_shoulder');
      
      if (prevLeftHip && prevRightHip && prevLeftShoulder && prevRightShoulder) {
        const prevCenter = {
          x: (prevLeftHip.x + prevRightHip.x + prevLeftShoulder.x + prevRightShoulder.x) / 4,
          y: (prevLeftHip.y + prevRightHip.y + prevLeftShoulder.y + prevRightShoulder.y) / 4
        };
        
        const velocity = {
          x: currentCenter.x - prevCenter.x,
          y: currentCenter.y - prevCenter.y
        };
        
        this.velocityHistory.push(velocity);
        if (this.velocityHistory.length > 5) {
          this.velocityHistory.shift();
        }
        
        // Calculate smoothed velocity
        const avgVelocity = this.velocityHistory.reduce(
          (acc, vel) => ({ x: acc.x + vel.x, y: acc.y + vel.y }),
          { x: 0, y: 0 }
        );
        avgVelocity.x /= this.velocityHistory.length;
        avgVelocity.y /= this.velocityHistory.length;
        
        const speed = Math.sqrt(avgVelocity.x * avgVelocity.x + avgVelocity.y * avgVelocity.y);
        return Math.min(speed * 0.15, 15); // Increased sensitivity and cap
      }
    }
    
    return 0;
  }

  private calculateJumpHeight(keypoints: PoseKeypoint[]): number {
    const leftHip = keypoints.find(kp => kp.name === 'left_hip');
    const rightHip = keypoints.find(kp => kp.name === 'right_hip');
    
    if (!leftHip || !rightHip) return 0;
    
    const hipHeight = (leftHip.y + rightHip.y) / 2;
    
    // Compare with baseline (would need calibration in real app)
    const baseline = 400; // Approximate standing hip height in pixels
    const jumpHeight = Math.max(0, baseline - hipHeight);
    
    return jumpHeight * 0.1; // Convert to approximate cm
  }

  private calculateCadence(keypoints: PoseKeypoint[], frameNumber: number): number {
    // Simplified cadence calculation based on leg movement
    const leftAnkle = keypoints.find(kp => kp.name === 'left_ankle');
    const rightAnkle = keypoints.find(kp => kp.name === 'right_ankle');
    
    if (!leftAnkle || !rightAnkle) return 0;
    
    // In a real implementation, we'd track ankle height over time
    // and count cycles. For demo, we'll simulate based on movement
    const movement = Math.abs(leftAnkle.y - rightAnkle.y);
    return Math.min(movement * 0.5, 180); // Cap at 180 steps/min
  }

  private calculateAgilityScore(keypoints: PoseKeypoint[]): number {
    // Calculate agility based on pose symmetry and joint alignment
    let score = 100;
    
    // Check shoulder alignment
    const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
    
    if (leftShoulder && rightShoulder) {
      const shoulderTilt = Math.abs(leftShoulder.y - rightShoulder.y);
      score -= shoulderTilt * 0.1;
    }
    
    // Check hip alignment
    const leftHip = keypoints.find(kp => kp.name === 'left_hip');
    const rightHip = keypoints.find(kp => kp.name === 'right_hip');
    
    if (leftHip && rightHip) {
      const hipTilt = Math.abs(leftHip.y - rightHip.y);
      score -= hipTilt * 0.1;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private assessInjuryRisk(keypoints: PoseKeypoint[]): InjuryRisk {
    const risks = { knees: 0, ankles: 0, shoulders: 0, back: 0 };
    
    // Knee alignment check
    const leftKnee = keypoints.find(kp => kp.name === 'left_knee');
    const rightKnee = keypoints.find(kp => kp.name === 'right_knee');
    const leftAnkle = keypoints.find(kp => kp.name === 'left_ankle');
    const rightAnkle = keypoints.find(kp => kp.name === 'right_ankle');
    
    if (leftKnee && leftAnkle) {
      const kneeAnkleDistance = Math.abs(leftKnee.x - leftAnkle.x);
      risks.knees += kneeAnkleDistance > 50 ? 30 : 0;
    }
    
    if (rightKnee && rightAnkle) {
      const kneeAnkleDistance = Math.abs(rightKnee.x - rightAnkle.x);
      risks.knees += kneeAnkleDistance > 50 ? 30 : 0;
    }
    
    // Shoulder posture check
    const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
    
    if (leftShoulder && rightShoulder) {
      const shoulderImbalance = Math.abs(leftShoulder.y - rightShoulder.y);
      risks.shoulders = shoulderImbalance > 30 ? 40 : 10;
    }
    
    // Overall risk assessment
    const avgRisk = Object.values(risks).reduce((sum, risk) => sum + risk, 0) / 4;
    const overall = avgRisk > 50 ? 'high' : avgRisk > 25 ? 'medium' : 'low';
    
    return { overall, areas: risks };
  }

  getFrameHistory(): AnalysisResult[] {
    return this.frameHistory;
  }

  reset() {
    this.previousPoses = [];
    this.frameHistory = [];
    this.velocityHistory = [];
  }
}

export const poseAnalyzer = new PoseAnalyzer();