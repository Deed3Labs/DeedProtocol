export const readFile = (file: File) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = function (readEvent) {
      resolve(readEvent.target?.result);
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.readAsText(file);
  });
};
