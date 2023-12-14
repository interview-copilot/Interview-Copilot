<template>
  <div>

    <div class="desc_text">
      The following settings are only retained locally in your browser.
      See <a :href="github_url" target="_blank">Github</a> for setup instructions.
    </div>

    <h1>Open AI</h1>
    <div class="desc_text">To use GPT, you need an API Key from the <a :href="open_ai_api_url" target="_blank">Open
      AI</a>
    </div>

    <div>
      <el-input placeholder="sk-xxxx" v-model="openai_key" @change="onKeyChange('openai_key')">
        <template slot="prepend">API Key:</template>
      </el-input>
    </div>

    <div class="separator">
      GPT Model:
      <el-radio-group v-model="gpt_model" @change="onKeyChange('gpt_model')">
        <el-radio label="gpt-3.5-turbo"></el-radio>
        <el-radio label="gpt-4"></el-radio>
      </el-radio-group>
    </div>

    <div class="separator">
      <div class="desc_text">GPT Prompt:</div>
      <el-input type="textarea" placeholder="You can setup custom prompt here" :rows="5"
                v-model="gpt_system_prompt" @change="onKeyChange('gpt_system_prompt')"/>
    </div>


    <h1>Azure Speech Recognition</h1>
    <div class="desc_text">
      We use Microsoft Azure's speech recognition service. You can apply for a free Azure token by referring to <a
        :href="azure_application_url" target="_blank">this tutorial</a>:
    </div>
    <el-input placeholder="Input Your Azure Speech Resource Token (KEY 1)" v-model="azure_token"
              @change="onKeyChange('azure_token')">
      <template slot="prepend">Azure token:</template>
    </el-input>
    <div class="separator"></div>
    <el-input placeholder="e.g. eastasia" v-model="azure_region" @change="onKeyChange('azure_region')">
      <template slot="prepend">Location/Region</template>
    </el-input>
    <div class="separator"></div>
    <el-input placeholder="e.g. en-US" v-model="azure_language" @change="onKeyChange('azure_language')">
      <template slot="prepend">Recognition Language</template>
    </el-input>

    <div class="desc_text">
      <span style="text-decoration: gray">zh-CN</span> for Chinese, See <a :href="full_language_codec_url"
                                                                           target="_blank">here</a> for
      other language codes
    </div>

<!--    <div>-->
<!--      <el-button @click="toDef">set all setting to default</el-button>-->
<!--    </div>-->

  </div>
</template>

<script>
import config_util from "../utils/config_util"

export default {
  name: 'HelloWorld',
  props: {},
  data() {
    return {
      openai_key: "",
      gpt_model: "gpt-3.5-turbo",
      gpt_system_prompt: "",
      azure_token: "",
      azure_region: "",
      azure_language: "",
      open_ai_api_url: "https://platform.openai.com/api-keys",
      github_url: "https://github.com/interview-copilot/Interview-Copilot",
      azure_application_url: "https://github.com/interview-copilot/Interview-Copilot/blob/main/docs/azure_speech_service_tutorial.md",
      full_language_codec_url: "https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=stt#speech-to-text"
    }
  },
  mounted() {
    this.openai_key = localStorage.getItem("openai_key")
    this.gpt_system_prompt = config_util.gpt_system_prompt()
    this.gpt_model = config_util.gpt_model()
    this.azure_token = localStorage.getItem("azure_token")
    this.azure_region = config_util.azure_region()
    this.azure_language = config_util.azure_language()
  },
  methods: {
    onKeyChange(key_name) {
      console.log("setItem", key_name, this[key_name])
      localStorage.setItem(key_name, this[key_name])
    },
    toDef() {
      localStorage.clear();
    }
  }


}


</script>
<style scoped>

.separator {
  margin-top: 10px;
}

.desc_text {
  color: gray;
  font-size: small;
  margin-bottom: 3px;
}

</style>
