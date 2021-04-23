let socket_admin_id = null;
let emailUser = null;

let socket = null;

document.querySelector("#start_chat").addEventListener("click", (event) => {
  socket = io();

  const chat_help = document.querySelector("#chat_help");
  chat_help.style.display = "none";

  const chat_in_support = document.querySelector("#chat_in_support");
  chat_in_support.style.display = "block";

  const email = document.getElementById("email").value;
  emailUser = email;

  const text = document.getElementById("txt_help").value;

  socket.on("connect", () => {
    const params = {
      email,
      text,
    };
    socket.emit("client_firts_access", params, (call, err) => {
      err ? console.error(err) : console.log(call);
    });
  });

  socket.on("client_list_all_messages", (messages) => {
    var template_client = document.querySelector("#message-user-template")
      .innerHTML;
    var template_admin = document.querySelector("#admin-template").innerHTML; // TOD

    messages.forEach((message) => {
      if (message.admin_id === null) {
        const rendered = Mustache.render(template_client, {
          message: message.text,
          email,
        });

        document.querySelector("#messages").innerHTML += rendered;
      } else {
        const rendered = Mustache.render(template_admin, {
          message_admin: message.text,
        });
        document.querySelector("#messages").innerHTML += rendered;
      }
    });
  });

  socket.on("admin_send_to_client", (message) => {
    socket_admin_id = message.socket;

    const template_admin = document.querySelector("#admin_template").innerHTML;

    const rendered = Mustache.render(template_admin, {
      message_admin: message.text,
    });

    document.querySelector("#messages").innerHTML += rendered;
  });
});

document
  .querySelector("#send_message_button")
  .addEventListener("click", (event) => {
    const text = document.querySelector("#message_user");

    const params = {
      text: text.value,
      socket_admin_id,
    };

    socket.emit("client_send_to_admin", params);

    const template_client = document.querySelector("#message_user_template")
      .innerHTML;

    const rendered = Mustache.render(template_client, {
      message: text.value,
      email: emailUser,
    });

    document.querySelector("#messages").innerHTML += rendered;
  });
