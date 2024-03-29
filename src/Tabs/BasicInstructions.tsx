import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Input,
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
  const [bpm, setBpm] = useState("");
  const [duration, setDuration] = useState("");
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
        await PlayInstruction(colorCodes, bpm, duration);
      } catch (e) {
        alert(e);
      } finally {
        props.onSendComplete();
      }

      props.onSendComplete();
      console.log(colorCodes);
    },
    [bpm, duration, tailCode, props.onSendComplete, props.onSending],
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
          <Typography level="title-sm">
            2. [可选，留空就只发送一次] 设定循环发送 BPM
          </Typography>
          <FormControl>
            <Input
              slotProps={{
                input: {
                  type: "number",
                  min: "10",
                  max: "120",
                },
              }}
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              placeholder="BPM"
            />
            <FormHelperText>
              太高的 BPM +
              较长的渐变效果会导致手环来不及响应新指令，此时可以尝试填入
              BPM/2。比如 《You Need To Calm Down》的 BPM 是 85，此处可以填入
              42.5。
            </FormHelperText>
          </FormControl>
          <FormControl>
            <Input
              slotProps={{
                input: {
                  type: "number",
                },
              }}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="持续时间（秒）"
            />
          </FormControl>
        </Stack>
        <Stack spacing={1}>
          <Typography level="title-sm">3. 发送颜色指令</Typography>
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
