/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState } from "react";
import * as css from "./Style";
import {
  Calender,
  ResponseStatsTime,
  StatsTime,
} from "../../../types/TimeStats";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useCookies } from "react-cookie";
import Calendar from "react-calendar";
import "../../../assets/src/Calendar.css";

export default function TimeStats() {
  const convertDate = new Date().toISOString().slice(0, 10);

  const [calendarBox, setCalendarBox] = useState<Calender>({ calendar: false });
  const [orderDate, setOrderDate] = useState<string>(convertDate);
  const [stats, setStats] = useState<StatsTime[]>([]);
  const [cookies] = useCookies(["token"]);

  const token = cookies.token;
  const calendarRef = useRef<HTMLDivElement>(null);

  const fetch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4041/api/v1/stats/time/${orderDate}T00:00:00`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const statsTimes: ResponseStatsTime[] = response.data.data;
      setStats(
        statsTimes.map((statsTime) => ({
          name: statsTime.hour,
          revenue: statsTime.revenue,
        }))
      );
    } catch (e) {
      console.error(e);
    }
  };

  //* 날짜 하루씩 변경 (이전/이후)
  const changeDate = (days: number) => {
    const currentDate = new Date(orderDate);
    currentDate.setDate(currentDate.getDate() + days);
    setOrderDate(currentDate.toISOString().slice(0, 10));
  };

  //* 캘린더 열기/닫기
  const handleCalendarOpen = () => {
    setCalendarBox((prevState) => ({
      ...prevState,
      calendar: !prevState.calendar,
    }));
  };

  //* 캘린더 안 날짜 선택
  const handleDateChange = (date: any) => {
    const selectDate = new Date(date);
    const formattedDate = selectDate.toLocaleDateString("en-CA");
    setOrderDate(formattedDate);
  
    setCalendarBox((prevState) => ({
      ...prevState,
      calendar: false,
    }));
  };

  //* 캘린더 외부 영역 선택 시 캘린더 닫기
  const handleClickOutside = (e: MouseEvent) => {
    if (
      calendarRef.current && !calendarRef.current?.contains(e.target as Node)
    ) {
      setCalendarBox({ calendar: false });
    }
  };
  
  useEffect (() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetch();
  }, [orderDate]);

  return (
    <>
      <div css={css.topContainer}>
        <div css={css.dateContainerStyle}>
          <button onClick={() => changeDate(-1)} css={css.buttonStyle}>
            ◀
          </button>
          <input
            type="text"
            onChange={(e) => setOrderDate(e.target.value)}
            value={orderDate}
            readOnly
            css={css.inputStyle}
          />
          <button onClick={() => changeDate(+1)} css={css.buttonStyle}>
            ▶
          </button>
        </div>
        <div css={css.calendarContainer}>
          <div css={css.calendarIconStyle} onClick={handleCalendarOpen} >
            <EventAvailableIcon sx={{ fontSize: 26 }}  />
          </div>
          <div
            ref={calendarRef}
            onClick={(e) => e.stopPropagation()}
            css={calendarBox.calendar ? css.calendarContainerBlock : css.calendarContainerNone}
          >
            <Calendar
              value={new Date(orderDate)}
              maxDate={new Date()}
              calendarType="gregory"
              defaultView="month"
              onChange={handleDateChange}
              tileClassName={({ date }) => {
                const day = date.getDay();
                if (day === 0) return 'sunday';
                else if (day === 6) return 'saturday';
              }}
            />
          </div>
        </div>
      </div>
      <div  css={stats.length > 0 ? css.chartContainer : css.chartLineNone}>
        <ResponsiveContainer 
          width={"85%"} 
          height={500} 
          style={{
            "border": "none"
        }}>
          <LineChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              name="매출"
              stroke="#1681FF"
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};