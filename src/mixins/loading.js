import { mapActions, mapGetters } from 'vuex';

const loading = {
  computed: {
    ...mapGetters([
      'loading',
    ]),
  },
  created() {
    this.stopLoading();
  },
  methods: {
    ...mapActions([
      'stopLoading',
    ]),
    startLoading(path) {
      if (path !== this.$route.path) {
        this.$store.dispatch('startLoading');
      }
    },
    cancel() {
      this.startLoading('');
      this.$router.go(-1);
    },
  },
};

export default loading;
