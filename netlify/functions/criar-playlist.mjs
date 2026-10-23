
export default async (request) => {
  // Aceita somente POST.
  if (request.method !== "POST") {
    return Response.json(
      { error: "Método não permitido." },
      { status: 405, headers: { Allow: "POST" } }
    );
  }

  // A URL do n8n vem de uma variável privada do Netlify.
  const webhook = process.env.N8N_WEBHOOK_URL;

  if (!webhook) {
    return Response.json(
      { error: "Webhook não configurado no servidor." },
      { status: 500 }
    );
  }

  try {
    const input = await request.json();
    const url = typeof input.url === "string" ? input.url.trim() : "";

    // Valida novamente no servidor, sem confiar no navegador.
    const pattern =
      /^https:\/\/www\.setlist\.fm\/setlist\/[^/?#]+\/\d{4}\/[^/?#]+-([0-9a-f]{4,})\.html(?:[?#].*)?$/i;

    const match = pattern.exec(url);

    if (!match) {
      return Response.json(
        { error: "URL de setlist.fm inválida." },
        { status: 400 }
      );
    }

    // Só permite os níveis de privacidade conhecidos.
    const allowedPrivacy = ["private", "unlisted", "public"];
    const privacy = allowedPrivacy.includes(input.privacy)
      ? input.privacy
      : "private";

    // Envia somente os campos esperados ao n8n.
    const upstream = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        setlistId: match[1],
        privacy,
        source: "setlist-to-youtube",
      }),
      signal: AbortSignal.timeout(55000),
    });

    const body = await upstream.text();

    // Devolve a resposta do n8n à interface.
    let data;
    try {
      data = body ? JSON.parse(body) : {};
    } catch {
      data = {
        error: upstream.ok
          ? "O n8n retornou uma resposta inválida."
          : "Erro ao executar o workflow no n8n.",
      };
    }

    return Response.json(data, {
      status: upstream.ok ? 200 : 502,
    });
  } catch (error) {
    console.error("Erro na função criar-playlist:", error);

    return Response.json(
      { error: "Não foi possível concluir a solicitação." },
      { status: 502 }
    );
  }
};
