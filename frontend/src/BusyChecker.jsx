import { useState } from "react";
import axios from "axios";
import { Input, Button, Spin } from "antd";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

export default function BusyChecker() {
    const [stationName, setStationName] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [graphData, setGraphData] = useState([]);

    const SERVICE_KEY = "6d677452716b73773130385068784878"; // 개인 API 키

    const handleCheck = async () => {
        if (!stationName) return;
        setLoading(true);
        try {
            const requestDate = "202111"; // 조회 월
            const line = "2호선"; // 고정: 2호선
            const url = `http://openapi.seoul.go.kr:8088/${SERVICE_KEY}/xml/CardSubwayTime/1/5/${requestDate}/${line}/${stationName}`;
            const response = await axios.get(url);

            if (response.data.includes("INFO-200")) {
                setResult([]);
                setGraphData([]);
            } else {
                setResult(response.data);

                const parsedData = await parseXMLtoJSON(response.data);
                const timeKeys = [
                    "HR_4",
                    "HR_5",
                    "HR_6",
                    "HR_7",
                    "HR_8",
                    "HR_9",
                    "HR_10",
                    "HR_11",
                    "HR_12",
                    "HR_13",
                    "HR_14",
                    "HR_15",
                    "HR_16",
                    "HR_17",
                    "HR_18",
                    "HR_19",
                    "HR_20",
                    "HR_21",
                    "HR_22",
                    "HR_23",
                    "HR_0",
                    "HR_1",
                    "HR_2",
                    "HR_3",
                ];

                const graphArray = timeKeys.map((hour) => {
                    const getOn = parseInt(parsedData[`${hour}_GET_ON_NOPE`] || "0", 10);
                    const getOff = parseInt(parsedData[`${hour}_GET_OFF_NOPE`] || "0", 10);

                    const congestionScore = getOn + getOff; // 승하차 총합으로 혼잡도 추정

                    return {
                        hour: hour.replace("HR_", "") + "시",
                        승차: getOn,
                        하차: getOff,
                        혼잡도: congestionScore
                    };
                });


                setGraphData(graphArray);
            }
        } catch (error) {
            console.error("Error fetching subway passenger data:", error);
            setResult([]);
            setGraphData([]);
        }
        setLoading(false);
    };

    const parseXMLtoJSON = async (xmlString) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlString, "text/xml");
        const item = xml.getElementsByTagName("row")[0];

        const result = {};
        if (item) {
            Array.from(item.children).forEach((child) => {
                result[child.tagName] = child.textContent;
            });
        }
        return result;
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>지하철 승하차 인원 조회 및 혼잡도 추정</h1>

            {/* 입력 */}
            <Input
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                style={{ width: "100%", marginBottom: 16 }}
                placeholder="역 이름 입력 (예: 강남)"
            />
            <Button type="primary" onClick={handleCheck} block loading={loading}>
                승하차 인원 조회
            </Button>

            {loading && <Spin style={{ marginTop: 20 }} />}

            {/* 차트 */}
            {graphData.length > 0 && (
                <div style={{ marginTop: 40 }}>
                    <h2>시간대별 승차/하차 인원</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={graphData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="승차" fill="#8884d8" />
                            <Bar dataKey="하차" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>

                    <h2 style={{ marginTop: 50 }}>시간대별 열차 혼잡도 추정</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={graphData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="혼잡도" stroke="#ff7300" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
