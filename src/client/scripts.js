(function () {
  var pusher = null;

  if ($("body").data("pusher-enabled")) {
    pusher = new Pusher($("body").data("pusher-key"), {
      cluster: $("body").data("pusher-cluster"),
      encrypted: true
    });
  }

  var LoginViewModel = {
    template: "#tpl-login",
    data: function () {
      return {
        alert: null
      };
    },
    methods: {
      login: function () {
        window.location.href = "./oidc/start";
      }
    }
  };

  var UserProfileViewModel = {
    template: "#tpl-user-profile",
    created: function () {
      var vm = this;

      $.ajax({
        type: "GET",
        url: "./user",
        headers: {
          "X-CSRF-Token": $("#csrf_token").val()
        },
        success: function (user) {
          vm.email = user.email;
          vm.phone = user.phone;
        },
        error: console.log
      });
    },
    data: function () {
      return {
        alert: null,
        email: "",
        phone: ""
      };
    },
    methods: {

    }
  };

  var OrderHistoryViewModel = {
    template: "#tpl-order-history",
    created: function () {
      var vm = this;

      $.ajax({
        type: "GET",
        url: "./orders",
        headers: {
          "X-CSRF-Token": $("#csrf_token").val()
        },
        success: function (orders) {
          vm.orders = orders;

          if (pusher) {
            var channel = pusher.subscribe("pod-" + $("#cid").val());

            channel.bind("pending", function (order) {
              Vue.set(vm.orders, "pending", order);
            });
            channel.bind("confirmed", function (order) {
              Vue.set(vm.orders, "pending", null);
              vm.orders.confirmed.push(order);
            });

            channel.bind('pusher:subscription_succeeded', function (status) { });
            channel.bind('pusher:subscription_error', function (status) { });
          }
        },
        error: console.log
      });
    },
    data: function () {
      return {
        alert: null,
        orders: {
          pending: null,
          confirmed: []
        }
      };
    },
    methods: {
      clear: function () {
        var vm = this;

        $.ajax({
          type: "DELETE",
          url: "./orders",
          headers: {
            "X-CSRF-Token": $("#csrf_token").val()
          },
          success: function () {
            vm.orders.confirmed.splice(0, vm.orders.confirmed.length);
          },
          error: console.log
        });
      }
    }
  };

  var PolicyViewModel = {
    template: "#tpl-policy",
    methods: {}
  };

  var routes = {
    "#/login": LoginViewModel,
    "#/profile": UserProfileViewModel,
    "#/orders": OrderHistoryViewModel,
    "#/policy": PolicyViewModel
  };

  var app = new Vue({
    el: "#app",
    data: {
      route: window.location.hash
    },
    computed: {
      getView: function () { return routes[this.route] || LoginViewModel; }
    },
    render: function (createElement) { return createElement(this.getView); }
  });
})();
