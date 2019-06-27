<template>
  	<form @submit="sendMessage" report-submit="true">
      <button form-type='submit'>
        <button form-type='submit'>
          <button form-type='submit'>
            <button form-type='submit'>
              <button form-type='submit'>
                <button form-type='submit'>
                  <button form-type='submit'>
                    <slot/>
                  </button>
                </button>
              </button>
            </button>
          </button>
        </button>
      </button>
    </form>
</template>

<script>
  export default {
    name: 'formButton',
    data () {
      return ({
        formidList: [],
        idCount: 7
      })
    },
    methods: {
    sendMessage: function (e) {
       const formId = e.detail.formId
       this.formidList.push(formId)
       console.log('this.formidList.length:',this.formidList.length)
        if (this.formidList.length === this.idCount) {
            this.$emit('onPress',this.formidList)
            this.formIdList = []
        }
      }
    }
  }
</script>

<style>
  button {
  margin: 0;
  display: inline;
  padding: 0;
}

button::after {
  content: '';
  display: none;
}
</style>
