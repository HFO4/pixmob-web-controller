import { Alert, Box, Button, Stack, Typography } from "@mui/joy";
import { special_effects } from "../IR/effects.ts";
import { useCallback } from "react";
import { TabProps } from "../App.tsx";
import { PlayInstruction } from "../IR/generator.ts";

const Effects = (props: TabProps) => {
  const sendInstruction = useCallback(
    (effectId: string) => async () => {
      props.onSending();
      // PlayInstruction([tailCode, colorId]);
      const codes = special_effects[effectId];
      if (!codes) {
        return;
      }

      // send POST request to
      try {
        await PlayInstruction(codes);
      } catch (e) {
        alert(e);
      } finally {
        props.onSendComplete();
      }

      props.onSendComplete();
    },
    [props.onSendComplete, props.onSending],
  );

  return (
    <Box>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Typography level="title-sm">发送特殊效果指令</Typography>
          <Alert>
            下面的指令包含了一些预设的效果，比如随机颜色变换等。你的手环可能无法支持所有的指令，可以多点点试试看。
          </Alert>
          <Box>
            {Object.keys(special_effects).map((effect) => (
              <Button
                sx={{
                  ml: 0.5,
                  mt: 0.5,
                }}
                key={effect}
                onClick={sendInstruction(effect)}
                color={"primary"}
              >
                {effect}
              </Button>
            ))}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Effects;
