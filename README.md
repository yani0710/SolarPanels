# SolarWise BG

Професионално Single Page Application MVP за бърза и честна ориентация при избор на соларна система.

## Stack

- Frontend: Vite, React, TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts
- Backend: Node.js, Express, TypeScript
- Database: SQLite чрез `node:sqlite`
- Auth: JWT + bcrypt

## Стартиране локално

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:4000/api`

## Полезни команди

```bash
npm run build
npm run typecheck
npm --workspace backend run dev
npm --workspace frontend run dev
```

## Environment

Копирай `.env.example` към `.env` в root или в `backend/.env` и промени стойностите при нужда.

## MVP функционалности

- Бърза оценка с малко въпроси и fallback стойности при "Не знам"
- Детайлна оценка с профили, уреди, backup нужди и условия на имота
- Препоръка за kWp, батерия, тип система и честни предупреждения
- Визуализации с Recharts
- Register/login/logout с JWT
- Запазени сценарии и custom уреди за логнати потребители
- LocalStorage за временен резултат при гости
- FAQ/education секция

## AI-ready архитектура

Rule-based логиката е отделена във `frontend/src/logic`. Backend моделите пазят `input_snapshot` и `result_snapshot`, така че по-късно може да се добави AI анализатор, който приема същия snapshot и връща подобрена препоръка.
