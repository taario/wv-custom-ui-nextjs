declare global {
  interface Window {
    Core: any;
  }
}
// eslint-disable-next-line consistent-return
const getWebViewerCore = async () => {
  if (typeof window !== "undefined") {
    const Core = (window as any).Core;
    return Core;
  }
};

export const initializeWebViewerInstance = async () => {
  const Core = await getWebViewerCore();
  Core.setWorkerPath("/webviewer/lib/core/");
  Core.enableFullPDF();
  //await Core.PDFNet.initialize();
  const instance = await new Core.DocumentViewer();
  return instance;
};

//   export const loadPDF = (instance, pdfUrl: string) => {
//     instance.loadDocument(pdfUrl, { extension: 'pdf' });
//   };
