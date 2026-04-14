import React, { useEffect, useState } from "react";
import { Box, Button, Paper, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CrudService } from "../api/CrudService";
import "../styles/welcome.css";

const quotes = [
  "Education is the most powerful weapon.",
  "Success is the sum of small efforts repeated daily.",
  "Dream big. Work hard. Stay focused.",
  "Your future is created by what you do today.",
];

// const getPercentage = (subjects: any[]) => {
//   const total = subjects.reduce((sum, s) => sum + s.marks, 0);
//   return Math.round(total / subjects.length);
// };

const WelcomePage = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");
  const [toppersByClass, setToppersByClass] = useState<any[]>([]);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    loadToppers();
  }, []);
  const loadToppers = async () => {
    // 1️️ Fetch all data
    const classes = await CrudService.getClasses();
    const students = await CrudService.get<any[]>("/students");
    const marks = await CrudService.get<any[]>("/marks");

    const allCards: any[] = [];

    // 2 Loop through classes
    for (const cls of classes) {
      // 3 Filter students belonging to this class
      const classStudents = students.filter((s) => s.classId === cls.id);

      if (!classStudents.length) continue;

      // 4 Build ranked list
      const ranked = classStudents
        .map((student) => {
          // 5 Get marks for this student
          const studentMarks = marks.filter((m) => m.studentId === student.id);

          if (!studentMarks.length) return null;

          const total = studentMarks.reduce(
            (sum, m) => sum + Number(m.marks),
            0,
          );

          const percentage = Math.round(total / studentMarks.length);

          return {
            ...student,
            percentage,
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 3);

      if (ranked.length) {
        allCards.push({
          className: cls.className,
          toppers: ranked,
        });
      }
    }

    setToppersByClass(allCards);
  };

  return (
    <Box
      className="welcome-container"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row",
        },
      }}
    >
      <Box
        className="left-section"
        sx={{
          width: {
            xs: "100%", 
            md: "50%", 
          },
          padding: {
            xs: 3,
            md: 6,
          },
          textAlign: {
            xs: "center",
            md: "left",
          },
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Welcome Students 👋
        </Typography>

        <Typography variant="h5" className="quote">
          “{quote}”
        </Typography>

        <Button
          variant="contained"
          size="large"
          className="login-btn"
          onClick={() => navigate("/login")}
        >
          Start To Login
        </Button>
      </Box>

      <Box
        className="right-section"
        sx={{
          width: {
            xs: "100%",
            md: "50%", 
          },
          padding: {
            xs: 2,
            md: 4,
          },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          className="slider"
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
          }}
        >
          <Box className="slider-track">
            {[...toppersByClass, ...toppersByClass].map((card, index) => (
              <Paper className="topper-card" key={index} elevation={6}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  {card.className}
                </Typography>

                <Box className="podium">
                  {card.toppers.map((s: any, i: number) => (
                    <Box key={s.id} className={`rank rank-${i + 1}`}>
                      <Avatar
                        src={s.photo || "/images/default-avatar.png"}
                        className="avatar"
                      />
                      <Typography fontWeight="bold">{s.name}</Typography>
                      <Typography variant="caption">{s.percentage}%</Typography>
                      <Typography variant="caption">
                        {i === 0 ? "🥇 1st" : i === 1 ? "🥈 2nd" : "🥉 3rd"}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default WelcomePage;
