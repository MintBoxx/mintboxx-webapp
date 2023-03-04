import React from "react";
import Link from "next/link";
import { Card } from "react-bootstrap";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Button from "/components/CustomButtons/Button.js";
import { useState, useEffect } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Form } from "antd";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import TextField from "@mui/material/TextField";

import InfoArea from "/components/InfoArea/InfoArea.js";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import Favorite from "@material-ui/icons/Favorite";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { NFTStorage, File, Blob } from "nft.storage";
import Muted from "/components/Typography/Muted.js";

import {
  QUICKMINT_FACTORY_ABI,
  QUICKMINT_FACTORY_ADDRESS,
  QUICKMINT_COLLECTION_ABI,
} from "../../blockchain/constants";
import { ethers } from "ethers";
import styles from "/styles/jss/nextjs-material-kit/pages/landingPageSections/workStyle.js";

const { Dragger } = Upload;
const steps = ["Enter NFT Details", "View Metadata", "Mint Your NFT"];
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
  const [collectionExists, setCollectionExists] = useState(null);
  const [collectionName, setCollectionName] = useState("");
  const [collectionSymbol, setCollectionSymbol] = useState("");
  const [address, setAddress] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [txHash, setTxHash] = useState("");
  const [imageLink, setImageLink] = useState("");

  useEffect(() => {
    // settingAddress();
    checkCollection();
  }, []);

  async function checkCollection() {
    const addr = localStorage.getItem("walletAddress");
    setAddress(addr);

    // Check if MetaMask is installed
    console.log("from check function in QuickMintForm.js: ", addr);
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask first.");
      return;
    }
    // Connect to the MetaMask provider
    window.addEventListener("load", async () => {
      try {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
      } catch (error) {}
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    // Create an instance of your smart contract
    const contractAddress = QUICKMINT_FACTORY_ADDRESS; // Replace with your contract address
    const abi = QUICKMINT_FACTORY_ABI; // Replace with your contract ABI
    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Get data from your smart contract
    const data = await contract.userCollectionExists(addr);
    // Use the data to render the page
    setCollectionExists(data);
    console.log(data);

    const user = await contract.userQuickMintCollection(addr);
    const collectionAddress = user[1];
    console.log(user);
    setCollectionAddress(collectionAddress);
    console.log(collectionAddress);
  }

  async function createCollection() {
    const addr = localStorage.getItem("walletAddress");
    if (!collectionExists) {
      // Check if MetaMask is installed
      console.log("from check function in QuickMintForm.js: ", addr);
      if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask first.");
        return;
      }

      // Connect to the MetaMask provider
      window.addEventListener("load", async () => {
        try {
          await window.ethereum.request({
            method: "eth_requestAccounts",
          });
        } catch (error) {}
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];

      // Get the signer for the account
      const signer = provider.getSigner(account);

      const contractAddress = QUICKMINT_FACTORY_ADDRESS; // Replace with your contract address
      const abi = QUICKMINT_FACTORY_ABI; // Replace with your contract ABI
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Create the transaction
      const transaction = await contract.CreateNewGreeter(
        collectionName,
        collectionSymbol,
        nftURI
      );

      // Sign the transaction
      const signedTransaction = await signer.signTransaction({
        to: transaction.to,
        nonce: transaction.nonce,
        // gasPrice: transaction.gasPrice,
        // gasLimit: transaction.gasLimit,
        data: transaction.data,
      });

      // Send the signed transaction to the network
      const jsonRpcProvider = new ethers.providers.JsonRpcProvider(
        window.ethereum
      );
      const transactionResponse = await jsonRpcProvider.sendTransaction(
        signedTransaction
      );

      console.log("Collection hash:", transactionResponse.hash);
      const user = await contract.userQuickMintCollection(addr);
      const collectionAddress = await user[1];
      console.log(collectionAddress);
      setCollectionAddress(collectionAddress);
    }
  }

  async function MintNFT() {
    const addr = localStorage.getItem("walletAddress");
    if (collectionAddress) {
      // Check if MetaMask is installed
      console.log("from check function in QuickMintForm.js: ", addr);
      if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask first.");
        return;
      }

      // Connect to the MetaMask provider
      window.addEventListener("load", async () => {
        try {
          await window.ethereum.request({
            method: "eth_requestAccounts",
          });
        } catch (error) {}
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // MetaMask requires requesting permission to connect users accounts
      // Request access to the user's MetaMask account
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];

      // Get the signer for the account
      const signer = provider.getSigner(account);

      const contractAddress = collectionAddress; // Replace with your contract address
      const abi = QUICKMINT_COLLECTION_ABI; // Replace with your contract ABI
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Create the transaction
      const transaction = await contract.quickMint(nftURI);

      console.log(transaction);
      setTxHash(transaction.hash);
      console.log(transaction.hash);
      console.log("NFT MINTED");
    }
  }

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
      let nftURI = "https://nftstorage.link/ipfs/" + metadata.url.slice(7);
      const data = await fetch(nftURI);
      const json = await data.json();

      let imageLink = "https://nftstorage.link/ipfs/" + json.image.slice(7);
      setImageLink(imageLink);
      setNFTURI(nftURI);
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

  const handleFinalMint = async () => {
    await MintNFT();
  };

  const handleNext = async () => {
    await createCollection();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setTwo(false);
    setThree(true);
  };

  if (loading) {
    return (
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
          <div style={{ color: "black" }}>Loading ...</div>
        </div>
      </div>
    );
  } else if (one) {
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
                    {!collectionExists && (
                      <>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="cname"
                          label="Collection Name"
                          name="Collection Name"
                          color="primary"
                          focused
                          sx={{ input: { color: "black" } }}
                          onChange={(event) =>
                            setCollectionName(event.target.value)
                          }
                        />
                        <br />
                        <br />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="Collection Symbol"
                          label="Collection Symbol"
                          type="text"
                          id="csymbol"
                          color="primary"
                          focused
                          sx={{ input: { color: "black" } }}
                          onChange={(event) =>
                            setCollectionSymbol(event.target.value)
                          }
                        />
                        <br />
                        <br />
                      </>
                    )}
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
            <div className={classes.section}>
              <Link href={nftURI}>
                <a target="_blank">
                  <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={4}>
                      <InfoArea
                        title="View Metadata Link"
                        icon={TouchAppIcon}
                        iconColor="danger"
                        vertical
                      />
                    </GridItem>
                  </GridContainer>
                </a>
              </Link>
            </div>

            <div style={{ color: "black" }}>
              <Button simple color="primary" size="lg" onClick={handleNext}>
                Ready to Mint
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  } else {
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
            <div style={{ color: "black" }}>
              {txHash ? (
                // If txHash is available, display it instead of the button
                <>
                  <div className={classes.section}>
                    <Link
                      href={
                        "https://hyperspace.filfox.info/en/message/" + txHash
                      }
                    >
                      <a target="_blank">
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={4}>
                           
                            <img src="https://wallet.filfox.info/dist/img/logo.2668bf1.svg"/>
                            <br/>
                            <br/>
                            <h4>View on Block Explorer</h4>
                          </GridItem>
                        </GridContainer>
                      </a>
                    </Link>
                  </div>
                </>
              ) : (
                // If txHash is not available, display the button
                <>
                  <div className={classes.section}>
                    <Card
                      style={{
                        margin: "0px 0px 0px 60px",
                        borderRadius: "15px 15px 15px 15px",
                        width: "545px",
                      }}
                    >
                      <Card.Body>
                        <Card.Img
                          src={imageLink}
                          style={{
                            width: "500px",
                            height: "200px",
                            borderRadius: "15px 15px 0px 0px",
                          }}
                        />

                        <br />
                        <br />
                        <Card.Title>
                          <strong>{name}</strong>
                        </Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          {description}
                        </Card.Subtitle>
                      </Card.Body>
                      <br />
                      <Card.Footer className="d-flex justify-content-between">
                        <Button color="primary" round onClick={handleFinalMint}>
                          <RocketLaunchIcon className={classes.icons} /> Mint
                          NFT
                        </Button>
                      </Card.Footer>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}
