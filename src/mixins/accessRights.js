const accessRights = {
  computed: {
    statusInOrganization() {
      if (!this.$route.params.organizationUuid) return null;
      const organization = this.user.organizations
        .find(org => org.uuid === this.$route.params.organizationUuid);
      return organization.options.status;
    },
  },
};

export default accessRights;
