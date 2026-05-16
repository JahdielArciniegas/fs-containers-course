/* eslint-disable no-undef */
import React from "react";
import { render, screen } from "@testing-library/react";
import Todo from "./Todo";
import "@testing-library/jest-dom";
import { test, expect } from "vitest";

test("renders Todo component", () => {
  const todo = { text: "Test todo", done: false };
  const deleteTodo = vi.fn();
  const completeTodo = vi.fn();

  render(
    <Todo todo={todo} deleteTodo={deleteTodo} completeTodo={completeTodo} />,
  );

  const element = screen.getByText("Test todo");
  expect(element).toBeInTheDocument();
});
