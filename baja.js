// Confirmar baja: lee c y f de la URL, y solo al tocar el botón manda el POST a la función baja.
(function () {
  "use strict";
  var BASE = "https://yhibcrioxeionrtymkks.supabase.co/functions/v1/baja";
  var UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  var HEX64 = /^[0-9a-f]{64}$/i;
  var $ = function (id) { return document.getElementById(id); };

  var params = new URLSearchParams(window.location.search);
  var c = params.get("c");
  var f = params.get("f");
  var estado = $("estado");

  function mostrar(texto, tipo) {
    estado.textContent = texto;
    estado.setAttribute("data-tipo", tipo);
    estado.hidden = false;
  }
  function vista(cual) {
    $("v-confirmar").hidden = cual !== "confirmar";
    $("v-invalido").hidden = cual !== "invalido";
    $("v-listo").hidden = cual !== "listo";
  }

  if (!c || !f || !UUID.test(c) || !HEX64.test(f)) {
    vista("invalido");
    return;
  }
  vista("confirmar");

  var boton = $("btn-baja");
  var enCurso = false;
  boton.addEventListener("click", function () {
    if (enCurso) return;
    enCurso = true;
    boton.disabled = true;
    estado.hidden = true;
    var url = BASE + "?c=" + encodeURIComponent(c.toLowerCase()) + "&f=" + encodeURIComponent(f.toLowerCase());
    fetch(url, { method: "POST", credentials: "omit", cache: "no-store", referrerPolicy: "no-referrer", redirect: "error" })
      .then(function (r) {
        if (r.ok) { vista("listo"); return; }
        if (r.status === 400) mostrar("Este enlace no es válido o ya venció.", "error");
        else mostrar("No pudimos procesar tu baja en este momento. Inténtalo de nuevo más tarde.", "error");
        enCurso = false; boton.disabled = false;
      })
      .catch(function () {
        mostrar("No pudimos conectar. Revisa tu internet e inténtalo de nuevo.", "error");
        enCurso = false; boton.disabled = false;
      });
  });
})();
