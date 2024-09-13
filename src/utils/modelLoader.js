import * as onnx from 'onnxjs';

export const loadModel = async () => {
  const model = new onnx.InferenceSession({ backendHint: 'webgl' }); // Use WebGL for better performance
  await model.loadModel('/models/liveness-model.onnx');
  return model;
};
