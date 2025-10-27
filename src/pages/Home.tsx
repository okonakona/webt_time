import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type TYPE ={
    year : number,
    month : number
}

export default function Home() {
    const nowDate = new Date();
    const nowMonth = nowDate.getMonth() + 1;
    const [state,setState] = useState<TYPE>({
        year : nowDate.getFullYear(),
        month : nowMonth
    });

    const [holidays, setHolidays] = useState<{[key: string] : string }>({});

    useEffect(() => {
        fetch(`https://date.nager.at/api/v3/PublicHolidays/${state.year}/JP`)
        .then((res) => res.json())
        .then((data) =>{
            const list: { [key: string]: string } = {} ;
            data.forEach((h:any) => {
                list[h.date] = h.localName
            });
            setHolidays(list)
        })
    },[state.year]);

    console.log(holidays);
    
    const week = ["日","月","火","水","木","金","土"]
    const days = Array.from({ length: 6 }, () => Array(7).fill(""));

    const newDay = new Date(state.year, state.month - 1, 1)
    const month = newDay.getMonth();
    for (let i = 0; i < days.length; i++) {
        for (let j = 0; j < days[0].length; j++) {
          if (newDay.getMonth() !== month) break; // 次の月に行ったら終わり
          if (i === 0 && j < newDay.getDay()) continue; // 月初の曜日調整
    
            days[i][j] = String(newDay.getDate());
            newDay.setDate(newDay.getDate() + 1);
        }
    }
        return (
    <>
        <main>
            <h2 className="text-sky-800 text-3xl">{state.year}</h2>
            <p className="text-9xl text-sky-800">{state.month}</p>
            <table className="text-3xl text-gray-700">
                <thead className="p-3">
                    <tr>{week.map((w,i) => <th key={i}>{w}</th> )}</tr>
                </thead>
                <tbody>
                    {days.map((weekRow, i) => (
                        <tr key={i}>
                        {weekRow.map((day, j) => {
                            const dateStr = `${state.year}-${String(state.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                            const isHoliday = holidays[dateStr];
                            const isSunday = j === 0;
                            const isSaturday = j === 6;

                            return (
                            <td
                                key={j}
                                className={`${
                                    isHoliday
                                    ? "text-pink-600 font-bold"
                                    : isSunday
                                    ? "text-pink-600 font-bold"
                                    : isSaturday
                                    ? "text-sky-800 font-bold"
                                    : ""
                                }`}
                                title={isHoliday || ""}
                            >
                                {day && (
                                <Link
                                    to={`/detail?date=${dateStr}`}
                                    className="block hover:bg-gray-200"
                                >
                                    {day}
                                </Link>
                                )}
                            </td>
                            );
                        })}
                        </tr>
                    ))}
                </tbody>
            </table>
                <div className="flex justify-center m-5">
                <button className="border rounded-md p-2 text-pink-600"
                onClick={ ()=>{
                if (state.month===1) {
                    setState({
                    ...state,
                    year : state.year -1,
                    month : 12
                    })
                }
                else{
                    setState({
                    ...state,
                    month : state.month - 1
                    })
                }
                }}>&lt;&lt;</button>
                <p className="p-2">前　後</p>
                <button className="border rounded-md p-2 text-pink-600"
                onClick={ ()=>{
                if (state.month===12) {
                    setState({
                    ...state,
                    year : state.year +1,
                    month : 1
                    })
                }
                else{
                    setState({
                    ...state,
                    month : state.month + 1
                    })
                }
                }}>&gt;&gt;</button>
            </div>

        </main>
    </>
    )
}

