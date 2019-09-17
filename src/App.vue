<template>
  <div class="container">
    <AppHeader/>
    <AppMain/>
  </div>
</template>

<script>


import AppHeader from './components/AppHeader.vue';
import AppMain from './components/AppMain.vue';

export default {
  name: 'app',
  components: { AppMain, AppHeader },
};
</script>

<style lang="scss">
  %default_big_font_size {
    font-size: 18px;
    line-height: 21px;
  }

  %default_size {
    min-width: 120px;
    width: 45%;
    max-width: 550px;
  }


  * {
    margin: 0;
    padding: 0;
    list-style: none;
    box-sizing: border-box;
  }

  .container {
    @extend %default_big_font_size;
    width: 100vw;
    font-family: Rubik, Helvetica, Arial, sans-serif;
    font-style: normal;
    font-weight: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 44px 15% 44px 41px;

    &__header, &__main {
      display: flex;
      flex-direction: column;
    }

    &__header {
      margin-bottom: 40px;
    }
  }

  .input-wrapper {
    display: flex;
    flex-direction: column;

    &__text {

    }

    &__input {
      @extend %default_size;
      height: 30px;
      margin-top: 5px;
    }
  }

  .button-header {
    @extend %default_size;
    @extend %default_big_font_size;
    width: 40%;
    margin-top: 20px;
    height: 50px;
    background-color: #EE514A;
    border: 0;
    color: white;
    font-weight: 500;

    &:disabled {
      background-color: #737373;
    }
  }

</style>
