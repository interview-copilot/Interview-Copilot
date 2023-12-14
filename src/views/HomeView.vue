<template>
  <div class="homeview_container">
    <div class="center_container">
      <div class="box">
        <div class="func_desc">
          <i class="el-icon-microphone"></i>
          Speech Recognition Results
        </div>
        <div v-if="!currentText" style="color: gray">No Content</div>
        <div class="asr_content">{{ currentText }}</div>
        <div class="single_part_bottom_bar">
          <el-button icon="el-icon-delete" :disabled="!currentText" @click="clearASRContent">
            Clear Text
          </el-button>
        </div>
      </div>
      <div class="box" style="border-left: none;">
        <div class="func_desc">
          <i class="el-icon-s-custom"></i>
          GPT Answer
        </div>
        <LoadingIcon v-show="show_ai_thinking_effect"/>
        <div class="ai_result_content">{{ ai_result }}</div>
        <div class="single_part_bottom_bar">
          <el-button icon="el-icon-thumb" @click="askCurrentText" :disabled="!isGetGPTAnswerAvailable">
            Ask GPT
          </el-button>
        </div>
      </div>
    </div>
    <div class="title_function_bar">
      <el-button
          type="success"
          @click="startCopilot" v-show="state==='end'" :loading="copilot_starting"
          :disabled="copilot_starting">Start Copilot
      </el-button>
      <el-button
          :loading="copilot_stopping"
          @click="userStopCopilot" v-show="state==='ing'">Stop Copilot
      </el-button>
      <MyTimer ref="MyTimer"/>
    </div>

  </div>
</template>

<script>
import Assert from "assert-js"
import LoadingIcon from "@/components/LoadingIcon.vue";
import MyTimer from "@/components/MyTimer.vue";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import OpenAI from "openai";
import config_util from "../utils/config_util"

export default {
  name: 'HomeView',
  props: {},
  computed: {
    isDevMode() {
      return (process.env.NODE_ENV === 'development')
    },
    isGetGPTAnswerAvailable() {
      // return this.state === "ing" && !!this.currentText
      return !!this.currentText

    }
  },
  components: {LoadingIcon, MyTimer},
  data() {
    return {
      currentText: "",
      state: "end", //end\ing
      ai_result: null,
      copilot_starting: false, //显示loading
      copilot_stopping: false,
      show_ai_thinking_effect: false,
      popStyle: {},
    }
  },
  async mounted() {
    console.log("mounted")
    if (this.isDevMode) {
      // this.currentText = demo_text
    }
  },
  beforeDestroy() {
  },
  methods: {
    async askCurrentText() {
      const apiKey = localStorage.getItem("openai_key")
      let content = this.currentText
      this.ai_result = ""
      this.show_ai_thinking_effect = true
      const model = config_util.gpt_model()
      const gpt_system_prompt = config_util.gpt_system_prompt()
      content = gpt_system_prompt + "\n" + content

      try {
        if (!apiKey) {
          throw new Error("You should setup an Open AI Key!")
        }

        const openai = new OpenAI({apiKey: apiKey, dangerouslyAllowBrowser: true})
        const stream = await openai.chat.completions.create({
          model: model,
          messages: [{role: "user", content: content}],
          stream: true,
        });
        this.show_ai_thinking_effect = false

        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || ""
          this.ai_result += text
        }
      } catch (e) {
        this.show_ai_thinking_effect = false
        this.ai_result = "" + e
      }
    },
    clearASRContent() {
      this.currentText = ""
    },
    async startCopilot() {
      this.copilot_starting = true
      const token = localStorage.getItem("azure_token")
      const region = config_util.azure_region()
      const language = config_util.azure_language()
      const openai_key = localStorage.getItem("openai_key")
      console.log({region, language})
      try {
        if (!openai_key) {
          throw new Error("You should setup Open AI API Token")
        }
        if (!token) {
          throw new Error("You should setup Azure token")
        }
        if (!region) {
          throw new Error("You should setup Azure region")
        }

        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(token, region);
        speechConfig.speechRecognitionLanguage = language;
        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        this.recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
      } catch (e) {
        this.currentText = e
        this.copilot_starting = false
        return
      }

      const recognizer = this.recognizer
      const sdk = SpeechSDK


      recognizer.recognized = (sender, event) => {
        if (sdk.ResultReason.RecognizedSpeech === event.result.reason && event.result.text.length > 0) {
          const text = event.result.text
          this.currentText = this.currentText + "\n" + text
        } else if (sdk.ResultReason.NoMatch === event.result.reason) {
          console.log("Speech could not be recognized")
        }
      };

      recognizer.startContinuousRecognitionAsync(
          () => {
            this.copilot_starting = false
            this.state = "ing"
            this.$refs.MyTimer.start()
            window.console.log("recognition started");
          },
          (err) => {
            this.copilot_starting = false
            this.currentText = "Start Failed:" + err
            window.console.error("recogniton start failed", err);
          })
    },
    userStopCopilot() {
      this.copilot_stopping = true
      this.recognizer.stopContinuousRecognitionAsync(() => {
        console.log("stoped")
        this.copilot_stopping = false
        this.state = "end"
        this.$refs.MyTimer.stop()
      }, (err) => {
        console.log("err:", err)
      })
    }
  }
}


const demo_text = `
Hello, thank you for coming for the interview. Please introduce yourself.

I'm Jhon, currently an undergraduate student majoring in Data Science at HK University. I am in the top 10% of my class, specializing in deep learning and proficient in web development. Additionally, I have contributed to several well-known open-source projects as mentioned in my resume.

Alright, let me ask you a machine learning question.

Sure, go ahead.

Can you explain the Hidden Markov Model?
`

async function sleep(ms) {
  return new Promise((resolve => setTimeout(resolve, ms)))
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.homeview_container {
  display: flex;
  flex-direction: column;
}

.title_function_bar {
  margin-top: 10px;
  text-align: center;
  margin-bottom: 10px;
}

.center_container {
  flex-grow: 1;
  display: flex;
  height: calc(100vh - 150px);
}

.box {
  flex: 1; /* 设置flex属性为1，使两个div平分父容器的宽度 */
  border: 1px lightgray solid; /* 为了演示，添加边框样式 */
  padding: 10px; /* 为了演示，添加内边距 */
  white-space: pre-wrap;
  display: flex;
  flex-direction: column;
}

.asr_content {
  overflow-y: auto;
  flex-grow: 1;
}


.func_desc {
  text-align: center;
}

.single_part_bottom_bar {
  display: flex;
}

.single_part_bottom_bar > .el-button {
  flex-grow: 1;
}


.ai_result_content {
  overflow-y: auto;
  flex-grow: 1;
}

.popup-tag {
  position: absolute;
  display: none;
  background-color: #785448d4;
  color: white;
  padding: 5px;
  font-size: 15px;
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
  -webkit-filter: drop-shadow(0 1px 10px rgba(113, 158, 206, 0.8));
}

.error_msg {
  color: red;
  text-align: center;
}

</style>
