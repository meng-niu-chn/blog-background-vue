 <template>
  <mavon-editor ref="editor" v-model="newValue" @change="autoSave" @imgAdd="imgAdd" @imgDel="imgDel"></mavon-editor>
</template>
    <script>
// Local Registration
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  name: "editor",
  components: {
    mavonEditor
    // or 'mavon-editor': mavonEditor
  },
  data() {
    return {};
  },
  props: ["value"],
  methods: {
    autoSave(value, render) {
      console.log("autoSave子组件");
       this.$emit('change',value,render);
    },
    imgAdd(pos, file) {
      this.$emit('imgAdd',pos,file);
    },
    imgDel(filename) {
      this.$emit('imgDel',filename);
    }
  },
  computed: {
    newValue: {
      get: function() {
        return this.value;
      },
      set: function(value) {
        this.$emit("input", value);
      }
    }
  }
};
</script>