import {
  Alert,
  Box,
  Button,
  Divider,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import Option from "@mui/joy/Option";
import { colorEffects, tail_codes } from "../IR/effects.ts";
import { useCallback, useState } from "react";
import { PlayInstruction } from "../IR/generator.ts";
import { TabProps } from "../App.tsx";

const NoTailCode = "NoTailCode";

const BasicInstructions = (props: TabProps) => {
  const [tailCode, setTailCode] = useState(NoTailCode);
  const handleTailCodeChange = (
    _event: React.SyntheticEvent | null,
    newValue: string | null,
  ) => {
    if (newValue) setTailCode(newValue);
  };

  const sendInstruction = useCallback(
    (colorId: string) => async () => {
      props.onSending();
      // PlayInstruction([tailCode, colorId]);
      let colorCodes = colorEffects.find(
        (effect) => effect.id === colorId,
      )?.data;
      if (!colorCodes) {
        return;
      }
      if (tailCode && tailCode != NoTailCode) {
        const tailCodeData = tail_codes.find(
          (code) => code.id === tailCode,
        )?.data;
        colorCodes = [...colorCodes, ...(tailCodeData ?? [])];
      }

      // send POST request to
      try {
        await PlayInstruction(colorCodes);
      } catch (e) {
        alert(e);
      } finally {
        props.onSendComplete();
      }

      props.onSendComplete();
      console.log(colorCodes);
    },
    [tailCode, props.onSendComplete, props.onSending],
  );

  return (
    <Box>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Typography level="title-sm">1. 追加效果选项</Typography>
          <Select value={tailCode} onChange={handleTailCodeChange}>
            <Option value="NoTailCode">
              <i>无追加效果</i>
            </Option>
            {tail_codes.map((code) => (
              <Option key={code.id} value={code.id}>
                {code.label}
              </Option>
            ))}
          </Select>
        </Stack>
        <Stack spacing={1}>
          <Typography level="title-sm">2. 发送颜色指令</Typography>
          <Box>
            {colorEffects.slice(0, 9).map((effect) => (
              <Button
                sx={{
                  ml: 0.5,
                  mt: 0.5,
                }}
                key={effect.id}
                onClick={sendInstruction(effect.id)}
                color={effect.buttonColor}
              >
                {effect.label}
              </Button>
            ))}
          </Box>
          <Divider />
          <Alert>
            注意，手环型号各异，下面某些颜色指令可能对你持有的手环无效果，此时请多尝试同一颜色的其他指令按钮。
          </Alert>
          <Box>
            {colorEffects.slice(9).map((effect) => (
              <Button
                sx={{
                  ml: 0.5,
                  mt: 0.5,
                }}
                key={effect.id}
                onClick={sendInstruction(effect.id)}
                color={effect.buttonColor}
              >
                {effect.label}
              </Button>
            ))}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default BasicInstructions;
