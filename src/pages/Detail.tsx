import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type FlowerData = {
  flower?: string;
  lang?: string;
  image?: string; 
};

type AnnivData = {
  anniv1?: string;
  anniv2?: string;
  anniv3?: string;
  anniv4?: string;
  anniv5?: string;
};

export default function Detail() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const date = params.get("date"); //  2025-10-13

  const [flower, setFlower] = useState<FlowerData | null>(null);
  const [anniv, setAnniv] = useState<AnnivData | null>(null);
  const [loading, setLoading] = useState(true);

  // "2025-10-13" → "1013" に変換
  const formatToMMDD = (dateStr: string) => {
    if (!dateStr) return "";
    const [, month, day] = dateStr.split("-");
    return `${month}${day}`;
  };

  useEffect(() => {
    if (!date) return;
    const mmdd = formatToMMDD(date);
    const PIXABAY_KEY = "52953177-e85f032ce707dc80127b24214"; 

    const getFlowerAndImage = async () => {
      try {
        // 誕生花と記念日を同時取得
        const [flowerRes, annivRes] = await Promise.all([
          fetch(`/api/index.cgi/v3/birthflower/${mmdd}`),
          fetch(`/api/index.cgi/v3/anniv/${mmdd}`),
        ]);

        const flowerData = await flowerRes.json();
        const annivData = await annivRes.json();

        // Pixabayから花の画像を検索
        let imageUrl = "";
        if (flowerData?.flower) {
          const imgRes = await fetch(
            `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(
              flowerData.flower
            )}&image_type=photo&orientation=horizontal&per_page=3`
          );
          const imgData = await imgRes.json();
          imageUrl = imgData.hits?.[0]?.webformatURL || "";
        }

        // flowerに画像を統合して保存
        setFlower({ ...flowerData, image: imageUrl });
        setAnniv(annivData);

        console.log("花データ:", flowerData);
        console.log("記念日データ:", annivData);
        console.log("画像URL:", imageUrl);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getFlowerAndImage();
  }, [date]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-400">{date}</h1>
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <>
          {flower && (
            <section className="rounded-xl">
              <h2 className="text-2xl font-semibold mb-2 text-pink-600">誕生花</h2>
              <p className="text-3xl font-bold 0">{flower.flower}</p>
              <p className="text-gray-700 mb-3">{flower.lang}</p>

              {flower.image ? (
                <img
                  src={flower.image}
                  alt={flower.flower}
                  className="w-[620px] m-auto rounded-xl"
                />
              ) : (
                <p className="text-sm text-gray-400">
                  ※画像が見つかりませんでした
                </p>
              )}

            </section>
          )}

          {anniv && (
            <section className="p-4">
              <h2 className="text-2xl font-semibold mb-2 text-sky-800">記念日</h2>
              <ul className="space-y-1 border rounded-xl p-5">
                {Object.entries(anniv)
                  .filter(([key, value]) => key.startsWith("anniv") && value)
                  .map(([key, value]) => (
                    <li key={key} className="text-lg">
                      {value}
                    </li>
                  ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
