import { Grid, Stack, Box, Typography, IconButton } from "@mui/material";
import Link from "next/link";
import React from "react";
import LaunchIcon from '@mui/icons-material/Launch';

interface CardPropsType{
  title:string,
  lastUpdated:string
}

const Card = ({title,lastUpdated}:CardPropsType) => {
  return (
    <Grid item xs={12} sm={3}>
      <Stack p={2} borderLeft="5px solid" borderColor={"#f4c558"} bgcolor={"#fff"}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box width="60%">
            <Typography
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace="nowrap"
              fontWeight={400}
              variant="h6"
            >
              {title}
            </Typography>
          </Box>
          <Link href="/StreamTest">
            <IconButton size="small">
              <LaunchIcon />
            </IconButton>
          </Link>
        </Stack>
        <Typography variant="caption">Updated on: {lastUpdated}</Typography>
      </Stack>
    </Grid>
  );
};

export default Card;
