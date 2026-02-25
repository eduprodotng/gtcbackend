// const path = require("path");
// const { createWorker } = require("tesseract.js");

// (async () => {
//   try {
//     // Await the creation of the worker
//     const worker = await createWorker({
//       // Optional: langPath if using local traineddata
//       // langPath: path.resolve(__dirname, './tessdata'),
//       cacheMethod: "none",
//     });

//     await worker.load();
//     await worker.loadLanguage(["eng"]);
//     await worker.initialize(["eng"]);

//     const {
//       data: { text },
//     } = await worker.recognize("path_to_a_sample_image.jpg");

//     console.log("Recognized text:", text);

//     await worker.terminate();
//   } catch (e) {
//     console.error("Tesseract error:", e);
//   }
// })();
const { createWorker } = require("tesseract.js");

(async () => {
  try {
    const worker = await createWorker();

    await worker.load();
    await worker.loadLanguage(["eng"]);
    await worker.initialize(["eng"]);

    const {
      data: { text },
    } = await worker.recognize("./d2.PNG");

    console.log("Recognized text:", text);

    await worker.terminate();
  } catch (e) {
    console.error("Tesseract error:", e);
  }
})();
