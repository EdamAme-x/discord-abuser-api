import { WebScraper } from "https://deno.land/x/webscraper/mod.ts"
function removeNull(arr) {
  return arr.filter(function(value) {
    return value !== "none";
  });
}
Deno.serve(async (req: Request) => {
    const dom = await (new WebScraper("https://xs295123.xsrv.jp")).getHTML();

    let a = Array.from(dom.querySelectorAll("body > div.body > p:nth-child(n)"))
    a = a.reverse()
    a.pop()
    a = a.reverse()

    const feat = new URL(req.url).searchParams.get("feat") ?? "";
    let data = removeNull(a.map(d => {
        if (d.innerText.includes(feat)) {
            return {
                index: d.innerText.split(",")[0].replace("ID: ", ""),
                id: d.innerText.split(",")[1].replace(" 名前: ", ""),
                feats: d.innerText.replace(" 特徴: ", "").split(",")[2].split("、"),
                link: d.innerText.split(",")[3].replace(" 関連リンク: ", "")
                }
        }

        return "none"    
    }))

    return new Response(JSON.stringify({
        "contents": data
        ,"created_by": "@amex2189"
    }), {
        headers: new Headers({
            "Content-Type": "application/json; charset=UTF-8"
        })
    })
});
