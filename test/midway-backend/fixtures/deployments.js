module.exports.admin_module_deployment = () => ({
  domain: {
    name: 'open-paas.org',
    hostnames: [
      'localhost',
      '127.0.0.1'
    ],
    company_name: 'linagora'
  },
  users: [
    {
      password: 'secret',
      firstname: 'Domain ',
      lastname: 'Administrator',
      accounts: [{
        type: 'email',
        hosted: true,
        emails: ['itadmin@open-paas.org']
      }]
    },
    {
      password: 'secret',
      firstname: 'John',
      lastname: 'Doe',
      accounts: [{
        type: 'email',
        hosted: true,
        emails: ['jdoe@open-paas.org']
      }]
    }
  ]
});
