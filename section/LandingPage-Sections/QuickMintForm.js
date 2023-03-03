import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "/components/Grid/GridContainer.js";
import Button from "/components/CustomButtons/Button.js";
import { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Form } from "antd";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import TextField from "@mui/material/TextField";

import { NFTStorage, File, Blob } from "nft.storage";

const { Dragger } = Upload;

const steps = ["Enter NFT Details", "Uploading on IPFS", "Minting your NFT"];

const NFT_STORAGE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhDNkQ4M2JiYzNiOWI5OUIwZENBOWNEOGM2NWZFMTJENWE3Qjk3NGUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NzUyNzMxNzk2MiwibmFtZSI6Ik1pbnRCb3h4In0.5UgYnasc2EyuDNkTJTLomcA0ozfBBpIXwmk_JKbN5kw";

const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

import styles from "/styles/jss/nextjs-material-kit/pages/landingPageSections/workStyle.js";

const useStyles = makeStyles(styles);

export default function QuickMintForm() {
  const classes = useStyles();

  const [fileBlob, setFileBlob] = useState(null);
  const [nftURI, setNFTURI] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [one, setOne] = useState(true);
  const [two, setTwo] = useState(false);
  const [three, setThree] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mintLauncher, setMintLauncher] = useState(false);

  const props = {
    name: "file",
    multiple: false,
    action: "/",
    onChange(info) {
      const { status, response } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        const reader = new FileReader();
        reader.readAsArrayBuffer(info.file.originFileObj);
        reader.onloadend = async () => {
          try {
            const blob = new Blob([reader.result], { type: info.file.type });
            setFileBlob(blob);
          } catch (error) {
            console.log(error);
          }
        };
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
      setFileList(info.fileList);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  async function uploadToIPFS() {
    setLoading(true);
    try {
      const client = new NFTStorage({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhDNkQ4M2JiYzNiOWI5OUIwZENBOWNEOGM2NWZFMTJENWE3Qjk3NGUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NzUyNzMxNzk2MiwibmFtZSI6Ik1pbnRCb3h4In0.5UgYnasc2EyuDNkTJTLomcA0ozfBBpIXwmk_JKbN5kw",
      });

      const metadata = await client.store({
        name: name,
        description: description,
        image: new File([fileBlob], "image.jpg", { type: "image/jpeg" }),
      });

      console.log("IPFS upload successful. Metadata:", metadata);
      console.log("Metadata url: ", metadata.url);

      let nftURI = "https://nftstorage.link/ipfs/" + metadata.url.slice(7);

      setNFTURI(nftURI);
      console.log("NFT URI : ", nftURI);
      return metadata.url;
    } catch (error) {
      console.error("IPFS upload failed:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FileBlob:", fileBlob);
    console.log("Name:", name);
    console.log("Description:", description);
    await uploadToIPFS();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setOne(false);
    setTwo(true);
    setLoading(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setTwo(false);
    setThree(true);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleClick = () => {
    setShowForm(true);
  };

  if (one) {
    return (
      <div className={classes.section}>
        <GridContainer justify="center">
          <>
            <div className="rounded-lg w-[500px]">
              <Box sx={{ width: "100%" }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>
                        <span style={{ color: "black" }}>{label}</span>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
              <br />

              <div className="items-center p-6">
                <Form
                  layout="vertical"
                  style={{ maxWidth: 600 }}
                  labelCol={{ span: 400, style: { color: "black" } }} // Add style property to change label color
                >
                  <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="title"
                      label="Title"
                      name="title"
                      color="primary"
                      focused
                      sx={{ input: { color: "black" } }}
                      onChange={(event) => setName(event.target.value)}
                    />
                    <br />
                    <br />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="description"
                      label="Description"
                      type="text"
                      id="description"
                      color="primary"
                      focused
                      sx={{ input: { color: "black" } }}
                      onChange={(event) => setDescription(event.target.value)}
                    />
                  </Box>
                  <br />

                  <Form.Item align="center" valuePropName="fileList">
                    <div className="rounded-xl bg-gradient-to-r from-blue-900 via-violet-500 to-blue-800 p-1">
                      <div className="items-center rounded-xl p-3 justify-center bg-slate-100 back">
                        <Dragger {...props} listType="picture">
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Click or drag file to this area to upload
                          </p>
                          <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly
                            prohibit from uploading company data or other band
                            files
                          </p>
                        </Dragger>
                      </div>
                    </div>
                  </Form.Item>

                  <Form.Item
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <br />
                    <Button
                      simple
                      color="primary"
                      size="lg"
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </>
        </GridContainer>
      </div>
    );
  } else if (two) {
    return (
      <>
      <div className={classes.section}>
        <div className="rounded-lg w-[500px]">
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>
                    <span style={{ color: "black" }}>{label}</span>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <br />
          <div>
            Metadata URI : {nftURI}
            <Button simple color="primary" size="lg" onClick={handleNext}>
              Mint
            </Button>
          </div>
        </div>
        </div>
      </>
    );
  } else if (three) {
    return (
      <>
      <div className={classes.section}>
        <div className="rounded-lg w-[500px]">
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>
                    <span style={{ color: "black" }}>{label}</span>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <br />
          <div>Mint NFT Button</div>
        </div>
        </div>
      </>
    );
  } else {
    return <div>Loading ...</div>;
  }
}


// https://i.pinimg.com/736x/95/2d/ca/952dcabb3176061abf09b4d86085901e.jpg