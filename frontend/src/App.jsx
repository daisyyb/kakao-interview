import React, { useState, useEffect, useCallback } from "react";
import { Input, Button, List, Typography, message } from "antd";
import "antd/dist/antd.css";

const { Title } = Typography;

function TodoInput({ task, onChange, onAdd }) {
    return (
        <div style={{ marginBottom: "20px" }}>
            <Input
                value={task}
                onChange={onChange}
                placeholder="할 일을 입력하세요"
                style={{ width: "300px", marginRight: "10px" }}
                onPressEnter={onAdd}
            />
            <Button type="primary" onClick={onAdd}>
                추가
            </Button>
        </div>
    );
}

const TodoList = React.memo(({ todos, onDelete, onDone }) => {
    return (
        <List
            bordered
            dataSource={todos}
            renderItem={(item, index) => (
                <List.Item
                    actions={[
                        <Button type="link" onClick={() => onDelete(index)}>
                            삭제
                        </Button>,
                        <Button type="link" onClick={() => onDone(index)}>
                            완료
                        </Button>
                    ]}
                >
                    {item}
                </List.Item>
            )}
        />
    );
});

function App() {
    const [task, setTask] = useState("");
    const [todos, setTodos] = useState([]);
    const [doneTodos, setDoneTodos] = useState([]);

    // 백엔드에서 할 일 목록 불러오기
    useEffect(() => {
        fetch("http://localhost:8080/api/todos")
            .then((response) => response.json())
            .then((data) => setTodos(data)); // 데이터를 받아서 todos 상태를 업데이트
    }, []);

    // 완료된 할 일 목록 불러오기
    useEffect(() => {
        fetch("http://localhost:8080/api/doneTodos")
            .then((response) => response.json())
            .then((data) => setDoneTodos(data)); // 데이터를 받아서 doneTodos 상태를 업데이트
    }, []);

    // 할 일 추가 함수
    const addTodo = useCallback(() => {
        if (task.trim()) {
            fetch("http://localhost:8080/api/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(task) // 새로운 할 일을 백엔드에 전달
            })
                .then(() => {
                    setTodos((prev) => [...prev, task]); // 상태 업데이트
                    setTask(""); // 입력창 초기화
                    message.success("할 일이 추가되었습니다!");
                })
                .catch(() => message.error("할 일 추가에 실패했습니다."));
        } else {
            message.warning("할 일을 입력해주세요.");
        }
    }, [task]);

    // 할 일 삭제 함수
    const deleteTodo = useCallback((index) => {
        fetch(`http://localhost:8080/api/todos/${index}`, {
            method: "DELETE"
        })
            .then(() => {
                setTodos((prev) => prev.filter((_, i) => i !== index)); // 해당 할 일 삭제
                message.info("할 일이 삭제되었습니다.");
            })
            .catch(() => message.error("할 일 삭제에 실패했습니다."));
    }, []);

    // 할 일 완료 처리 함수
    const markAsDone = useCallback((index) => {
        fetch(`http://localhost:8080/api/todos/${index}`, {
            method: "PUT"
        })
            .then(() => {
                const doneTask = todos[index];
                setDoneTodos((prev) => [...prev, doneTask]); // 완료된 할 일 목록에 추가
                setTodos((prev) => prev.filter((_, i) => i !== index)); // todos 목록에서 삭제
                message.success("할 일이 완료되었습니다.");
            })
            .catch(() => message.error("할 일 완료 처리에 실패했습니다."));
    }, [todos]);

    return (
        <div style={{ padding: "20px" }}>
            <Title level={2}>Todo List (React 연습)</Title>
            <TodoInput task={task} onChange={(e) => setTask(e.target.value)} onAdd={addTodo} />
            <TodoList todos={todos} onDelete={deleteTodo} onDone={markAsDone} />

            <Title level={4}>완료된 항목</Title>
            <List
                bordered
                dataSource={doneTodos}
                renderItem={(item) => <List.Item>{item}</List.Item>}
            />
        </div>
    );
}

export default App;
