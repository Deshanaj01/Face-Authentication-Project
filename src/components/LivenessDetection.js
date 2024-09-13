// src/components/LivenessDetection.js

import * as onnx from 'onnxjs';
import { preprocessImage, postProcessOutput } from '../utils/livenessHelper';

const LivenessDetection = async (imageData) => {
  try {
    // Load the ONNX model
    const session = new onnx.InferenceSession();
    // The path is relative to the public directory
    await session.loadModel('/models/face_detection_model.onnx');

    // Preprocess the image
    const inputTensor = await preprocessImage(imageData);

    // Run inference
    const outputMap = await session.run([inputTensor]);
    const outputTensor = outputMap.values().next().value;

    // Post-process the output
    const result = postProcessOutput(outputTensor.data);

    // Determine if liveness check passed (adjust threshold as needed)
    const livenessThreshold = 0.5;
    return result > livenessThreshold;
  } catch (error) {
    console.error('Liveness detection error:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      console.error('ONNX model file not found. Please check if the file exists in the correct location.');
    }
    return false;
  }
};

export default LivenessDetection;