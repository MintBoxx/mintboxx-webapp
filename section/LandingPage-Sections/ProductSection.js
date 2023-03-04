import React from "react";
import Link from "next/link";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons

import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import StyleIcon from "@mui/icons-material/Style";
import UpcomingIcon from "@mui/icons-material/Upcoming";
// core components
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import InfoArea from "/components/InfoArea/InfoArea.js";

import styles from "/styles/jss/nextjs-material-kit/pages/landingPageSections/productStyle.js";

const useStyles = makeStyles(styles);

export default function ProductSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={8}>
          <h2 className={classes.title}>Explore MintBoxx</h2>
        </GridItem>
      </GridContainer>
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <Link href="/quickmint">
              <a target="_blank">
                <InfoArea
                  title="Quick Mint"
                  description="Convert your memorable moment or creative art work into a NFT in few clicks"
                  icon={RocketLaunchIcon}
                  iconColor="info"
                  vertical
                />
              </a>
            </Link>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Link href="/mintCollection">
              <a target="_blank">
                <InfoArea
                  title="Mint Collection"
                  description="Mint and launch a complete NFT collection on Filecoin Virtual Machine"
                  icon={StyleIcon}
                  iconColor="success"
                  vertical
                />
              </a>
            </Link>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Link href="/mysteryBox">
              <a target="_blank">
                <InfoArea
                  title="Mystery Boxx"
                  description="Spice your NFTs with the flavour of ZK and Access Control"
                  icon={UpcomingIcon}
                  iconColor="danger"
                  vertical
                />
              </a>
            </Link>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
