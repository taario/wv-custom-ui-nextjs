import Head from "next/head";
import styles from "@/styles/Home.module.css";

import { useEffect, useRef, useState } from "react";

import ZoomIn from "../../public/assets/icons/ic_zoom_in_black_24px.svg";
import ZoomOut from "../../public/assets/icons/ic_zoom_out_black_24px.svg";
import AnnotationRectangle from "../../public/assets/icons/ic_annotation_square_black_24px.svg";
import AnnotationRedact from "../../public/assets/icons/ic_annotation_add_redact_black_24px.svg";
import AnnotationApplyRedact from "../../public/assets/icons/ic_annotation_apply_redact_black_24px.svg";
import Search from "../../public/assets/icons/ic_search_black_24px.svg";
import Select from "../../public/assets/icons/ic_select_black_24px.svg";
import EditContent from "../../public/assets/icons/ic_edit_page_24px.svg";
import AddParagraph from "../../public/assets/icons/ic_paragraph_24px.svg";
import AddImageContent from "../../public/assets/icons/ic_add_image_24px.svg";

import { initializeWebViewerInstance } from "../../utils/constants";
//import SearchContainer from "../components/SearchContainer";

export default function Home() {
  const viewer = useRef(null);
  const scrollView = useRef(null);
  const searchTerm = useRef(null);
  const searchContainerRef = useRef(null);

  const [documentViewer, setDocumentViewer] = useState<any>(null);
  const [annotationManager, setAnnotationManager] = useState<any>(null);
  const [searchContainerOpen, setSearchContainerOpen] = useState(false);
  const [isInContentEditMode, setIsInContentEditMode] = useState(false);
  const [Annotations, setAnnotations] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const instance = await initializeWebViewerInstance();
      instance.setScrollViewElement(scrollView.current);
      instance.setViewerElement(viewer.current);
      instance.setOptions({ enableAnnotations: true });
      instance.loadDocument("/files/PDFTRON_about.pdf");

      setDocumentViewer(instance);
      setAnnotations((window as any).Core.Annotations);

      instance.addEventListener("documentLoaded", () => {
        console.log("document loaded");
        //documentViewer.setToolMode(documentViewer.getTool(Core.Tools.ToolNames.EDIT));
        setAnnotationManager(instance.getAnnotationManager());
      });
    })();
  }, []);

  const zoomOut = () => {
    documentViewer.zoomTo(documentViewer.getZoom() - 0.25);
  };

  const zoomIn = () => {
    documentViewer.zoomTo(documentViewer.getZoom() + 0.25);
  };

  const startEditingContent = () => {
    const contentEditManager = documentViewer.getContentEditManager();
    contentEditManager.startContentEditMode();
    setIsInContentEditMode(true);
  };

  const endEditingContent = () => {
    setIsInContentEditMode(false);
    documentViewer.setToolMode(
      documentViewer.getTool(window.Core.Tools.ToolNames.EDIT)
    );
    const contentEditManager = documentViewer.getContentEditManager();
    contentEditManager.endContentEditMode();
  };

  const addParagraph = () => {
    if (isInContentEditMode) {
      const addParagraphTool = documentViewer.getTool(
        window.Core.Tools.ToolNames.ADD_PARAGRAPH
      );
      documentViewer.setToolMode(addParagraphTool);
    } else {
      alert("Content Edit mode is not enabled.");
    }
  };

  const addImageContent = () => {
    if (isInContentEditMode) {
      const addImageContentTool = documentViewer.getTool(
        window.Core.Tools.ToolNames.ADD_IMAGE_CONTENT
      );
      documentViewer.setToolMode(addImageContentTool);
    } else {
      alert("Content Edit mode is not enabled.");
    }
  };

  const createRectangle = () => {
    documentViewer.setToolMode(
      documentViewer.getTool(window.Core.Tools.ToolNames.RECTANGLE)
    );
  };

  const selectTool = () => {
    documentViewer.setToolMode(
      documentViewer.getTool(window.Core.Tools.ToolNames.EDIT)
    );
  };

  const createRedaction = () => {
    documentViewer.setToolMode(
      documentViewer.getTool(window.Core.Tools.ToolNames.REDACTION)
    );
  };

  const applyRedactions = async () => {
    const annotationManager = documentViewer.getAnnotationManager();
    annotationManager.enableRedaction();
    await annotationManager.applyRedactions();
  };

  return (
    <>
      <Head>
        <script src="/webviewer/lib/core/webviewer-core.min.js"></script>
        <script src="/webviewer/lib/core/pdf/PDFNet.js"></script>
      </Head>
      <div className="MyComponent">
        <div id="main-column">
          <div className="center" id="tools">
            <button onClick={zoomOut}>
              <ZoomOut />
            </button>
            <button onClick={zoomIn}>
              <ZoomIn />
            </button>
            <button onClick={startEditingContent} title="Switch to edit mode">
              <EditContent />
            </button>
            <button onClick={addParagraph} title="Add new paragraph">
              <AddParagraph />
            </button>
            <button onClick={addImageContent} title="Add new content image">
              <AddImageContent />
            </button>
            <button onClick={endEditingContent} title="End edit mode">
              Finish Editing
            </button>
            <button onClick={createRectangle}>
              <AnnotationRectangle />
            </button>
            <button onClick={createRedaction} title="Create Redaction">
              <AnnotationRedact />
            </button>
            <button onClick={applyRedactions} title="Apply Redactions">
              <AnnotationApplyRedact />
            </button>
            <button onClick={selectTool}>
              <Select />
            </button>
            <button
              onClick={() => {
                // Flip the boolean
                setSearchContainerOpen((prevState) => !prevState);
              }}
            >
              <Search />
            </button>
          </div>
          <div className="flexbox-container" id="scroll-view" ref={scrollView}>
            <div id="viewer" ref={viewer}></div>
          </div>
        </div>
        <div className="flexbox-container">
          {/* TODO: Refactor SearchContainer for TS */}
          {/* <SearchContainer
            Annotations={Annotations}
            annotationManager={annotationManager}
            documentViewer={documentViewer}
            searchTermRef={searchTerm}
            searchContainerRef={searchContainerRef}
            open={searchContainerOpen}
          /> */}
        </div>
      </div>
    </>
  );
}
