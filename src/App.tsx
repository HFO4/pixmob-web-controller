import {
  Box,
  Button,
  Grid,
  Modal,
  Sheet,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import BasicInstructions from "./Tabs/BasicInstructions.tsx";
import Effects from "./Tabs/Effects.tsx";
import React, { useState } from "react";
import { GitHub } from "./Icons/GitHub.tsx";
import { Flip } from "./Icons/Flip.tsx";

export interface TabProps {
  onSending: () => void;
  onSendComplete: () => void;
}

function App() {
  const [sending, setSending] = useState(false);
  const flip = () => {
    window.document.body.style.transform =
      window.document.body.style.transform != "" ? "" : "rotate(-180deg)";
  };
  return (
    <>
      <Grid container spacing={1} sx={{ flexGrow: 1 }}>
        <Grid xs={12}>
          <Box
            sx={{
              mx: 1,
              mt: 3,
            }}
          >
            <Typography level="h3" variant="plain">
              Pixmob 遥控器
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Button
                component="a"
                target={"_blank"}
                href="https://github.com/HFO4/pixmob-web-controller"
                variant="soft"
                startDecorator={<GitHub />}
              >
                GitHub
              </Button>
              <Button
                sx={{ ml: 1 }}
                startDecorator={<Flip />}
                variant="soft"
                onClick={() => flip()}
              >
                上下反转页面
              </Button>
            </Box>
          </Box>
          <Sheet
            sx={{
              mx: 1,
              my: 4, // margin top & bottom
              gap: 2,
              borderRadius: "sm",
              boxShadow: "md",
            }}
            variant="outlined"
          >
            <Tabs
              sx={{
                borderRadius: "sm",
              }}
              aria-label="Basic tabs"
              defaultValue={0}
            >
              <TabList>
                <Tab>基础指令</Tab>
                <Tab>特殊效果指令</Tab>
              </TabList>
              <TabPanel value={0}>
                <BasicInstructions
                  onSending={() => setSending(true)}
                  onSendComplete={() => setSending(false)}
                />
              </TabPanel>
              <TabPanel value={1}>
                <Effects
                  onSending={() => setSending(true)}
                  onSendComplete={() => setSending(false)}
                />
              </TabPanel>
            </Tabs>
          </Sheet>
        </Grid>
      </Grid>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={sending}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 500,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            发送指令...
          </Typography>
        </Sheet>
      </Modal>
    </>
  );
}

export default App;
