import generateDalleImage from './generateDalleImage.js';
import saveB64Image from './saveB64Image.js';

class ImageProcessor {
  constructor() {}

  async generateImageAndSaveFile(subject, word, prompt) {
    try {
      const img = await generateDalleImage(prompt);
      if (img) {
        const imgName = await saveB64Image(img, subject, word, prompt);
        return imgName;
      }
    } catch (error) {
      console.error('Error generating or saving image:', error);
      throw error;
    }
  }
}

export default ImageProcessor;
