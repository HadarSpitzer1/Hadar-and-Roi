import React, { useState } from 'react'

// Mock database with three tables
const mockDatabase = {
    table1: {
        schools: ['הרטמן - ירושלים', 'תלמה ילין - גבעתיים'],
        hours: [
            '8:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00',
        ],
        teachers: ['מר כהן', 'גברת לוי', 'מר רפאל', 'גברת סויסה', 'מר ביטון', 'גברת שפירא'],
    },
    table2: {
        schools: ['יזרעאלי - חיפה', 'הראל - ירושלים', 'קציר - חיפה'],
        hours_range: [
            '8:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00',
        ],
        teachers: ['ד"ר אשכנזי', 'פרופ׳ חדד', 'ד"ר כהן', 'פרופ׳ גולן', 'ד"ר אמסלם'],
    },
    table3: {
        schools: ['ידידיה - ירושלים', 'תיכון שהם - שהם', 'בן גוריון - הרצליה'],
        hours_range: [
            '7:00 - 9:00', '9:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00',
        ],
        teachers: ['מר גפני', 'גברת חורי', 'מר אלבז', 'גברת אבו חדיר', 'מר מלכה'],
    },
}

// Color classes for styling
const colorClasses = ['bg-blue-50']

export default function Component() {
    const [currentTable, setCurrentTable] = useState('table1')
    const [schedule, setSchedule] = useState({})

    const { schools, teachers } = mockDatabase[currentTable]
    const hours =
        currentTable === 'table1'
            ? mockDatabase.table1.hours
            : mockDatabase[currentTable].hours_range

    const handleTeacherSelect = (school, hour, teacher) => {
        setSchedule((prev) => ({
            ...prev,
            [school]: {
                ...prev[school],
                [hour]: teacher,
            },
        }))
    }

    return (
        <div className="min-h-screen p-8 bg-gray-100 text-gray-800">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-lg">
                    <div className="relative">
                        <select
                            value={currentTable}
                            onChange={(e) => setCurrentTable(e.target.value)}
                            className="appearance-none bg-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="table1">לקות שמיעה</option>
                            <option value="table2">לקות למידה</option>
                            <option value="table3">לקות התנהגות</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                                className="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-700">מערכת שיבוץ</h1>
                </div>

                {/* Schedule Table */}
                <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                    <table className="w-full" dir="rtl"> {/* Apply RTL to entire table */}
                        <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="p-3 text-center rounded-tl-lg">שעות</th> {/* Center-aligned */}
                            {schools.map((school, index) => (
                                <th
                                    key={school}
                                    className={`p-3 text-center border-l ${
                                        index === schools.length - 1 ? 'rounded-tr-lg' : ''
                                    }`}
                                >
                                    {school}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {hours.map((hour, rowIndex) => (
                            <tr key={hour} className="border-b">
                                <td
                                    className="p-3 font-medium bg-gray-100 text-center text-gray-700"
                                    dir="ltr" // Force LTR for the hours text
                                >
                                    {hour}
                                </td>
                                {schools.map((school, colIndex) => (
                                    <td
                                        key={`${school}-${hour}`}
                                        className={`p-3 text-center border-l ${
                                            colorClasses[(rowIndex + colIndex) % colorClasses.length]
                                        }`}
                                    >
                                        <select
                                            className="w-full bg-white hover:bg-gray-100 border border-gray-300 rounded px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                            value={schedule[school]?.[hour] || ''}
                                            onChange={(e) =>
                                                handleTeacherSelect(school, hour, e.target.value)
                                            }
                                        >
                                            <option value="">בחר מורה</option>
                                            {teachers.map((teacher) => (
                                                <option key={teacher} value={teacher}>
                                                    {teacher}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
