export const readFileAsync = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    try {
      reader.onload = function (readEvent) {
        resolve(readEvent.target?.result);
      };
      reader.onerror = function (error) {
        reject(error);
      };
      reader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  });
};
