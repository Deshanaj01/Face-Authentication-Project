import * as onnx from 'onnxjs'; // Import ONNX.js
export const preprocessImage = (imageData) => {
    const image = new Image();
    image.src = imageData;
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 224;
    canvas.height = 224;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
  
    const imageDataArray = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const inputTensor = new Float32Array(224 * 224 * 3);
  
    for (let i = 0; i < imageDataArray.length; i += 4) {
      inputTensor[(i / 4) * 3] = imageDataArray[i] / 255; // R
      inputTensor[(i / 4) * 3 + 1] = imageDataArray[i + 1] / 255; // G
      inputTensor[(i / 4) * 3 + 2] = imageDataArray[i + 2] / 255; // B
    }
  
    return new onnx.Tensor(inputTensor, 'float32', [1, 3, 224, 224]);
  };
  
  // Add postProcessOutput function
  export const postProcessOutput = (output) => {
    // Example output processing (adjust for your needs)
    const maxScoreIndex = output.indexOf(Math.max(...output));
    return maxScoreIndex;  // Example: return index of highest confidence
  };
  