import { NextPage } from "next";
import Head from "next/head";
import LandingPageTemplate from "../templates/LandingPage/LandingPageTemplate";
import DropZoneComponent from "@/components/DropZone";
import { Main } from "next/document";
import { useState } from "react";
import styled from "@emotion/styled";
import ButtonProcess from "@/components/ButtonProcess";
import { CheckFileHelper } from "@/helper/checkFileHelper";
import { ProcessingFileHelper } from "@/helper/processingFileHelper";
import OutputProcess from "@/components/OutputProcess";
import ButtonDownload from "@/components/ButtonDownload";
import { OutputFileType } from "@/type/outputfileType";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 4rem);
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 1rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const Index: NextPage = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [outputFile, setOutputFile] = useState<OutputFileType | null>(null);
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const [isCompression, setIsCompression] = useState<boolean>(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const { errorMessage, isValid } = CheckFileHelper(file);

    if (!isValid) {
      alert(errorMessage);
      event.target.value = ""; // reset the input field
      return;
    }

    if (outputFile) {
      setOutputFile(null);
    }
    setFileName(file.name);
    setSelectedFile(file);
  };

  const handleButtonProcess = async () => {
    setIsProcessing(true);

    // console.log("selectedFile", selectedFile);

    if (selectedFile?.type.includes("image")) {
      await ProcessingFileHelper({
        file: selectedFile,
        maxWidth: maxWidth,
        maxHeight: maxHeight,
        isCompression: isCompression,
      })
        .then((details) => {
          setOutputFile(details);
          setIsProcessing(false);
        })
        .catch((error) => {
          console.error("ProcessingFileHelper error", error);
          setIsProcessing(false);
        });
    } else if (selectedFile?.type.includes("audio")) {
      await ProcessingFileHelper({
        file: selectedFile,
      })
        .then((details) => {
          setOutputFile(details);
          setIsProcessing(false);
        })
        .catch((error) => {
          console.error("ProcessingFileHelper error", error);
          setIsProcessing(false);
        });
    }
  };

  return (
    <>
      <Head>
        <title>Media-Kit</title>
        <meta name="description" content="Generated by Create Next Stack." />
      </Head>
      {/* <LandingPageTemplate /> */}

      <MainContainer>
        <MainContent>
          <DropZoneComponent
            selectedFile={selectedFile}
            fileName={fileName}
            handleFileUpload={handleFileUpload}
          />

          <label>
            Max Width:
            <input
              type="number"
              initialValue={maxWidth}
              onChange={(e) => setMaxWidth(Number(e.target.value))}
            />
            Max Height:
            <input
              type="number"
              initialValue={maxHeight}
              onChange={(e) => setMaxHeight(Number(e.target.value))}
            />
          </label>

          <label>
            <input
              type="checkbox"
              checked={isCompression}
              onChange={(e) => setIsCompression(e.target.checked)}
            />
            Compression
          </label>

          <ButtonProcess
            onClick={() => handleButtonProcess()}
            isProcessing={isProcessing}
          />

          {isProcessing && <p>Processing...</p>}
          {outputFile && (
            <>
              <OutputProcess
                outputFile={outputFile}
                selectedFileSize={selectedFile?.size || 0}
              />
              <ButtonDownload outputFile={outputFile} />
            </>
          )}
        </MainContent>
      </MainContainer>
    </>
  );
};

export default Index;
