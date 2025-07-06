import { NextResponse } from "next/server";

type SResponse<T> = {
  data: T;
  message: string;
};
type FResponse = {
  message: string;
  status?: number;
};

export const successResponse = <T>({ data, message }: SResponse<T>) => {
  return NextResponse.json({ status: true, data, message }, { status: 200 });
};

export const errorResponse = ({ message, status = 500 }: FResponse) => {
  return NextResponse.json({ status: false, data: null, message }, { status });
};
