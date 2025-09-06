import { api, type ApiError } from "@services/api";
import axios from "axios";
import { ClientForm } from "./schemas";
import { Client } from "./types";

export async function createClient(data: ClientForm) {
  try {
    const response = await api.post<Client>("/clients", data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(
        errorData?.error ||
          errorData?.message ||
          errorData?.errors?.join(", ") ||
          "Registration failed"
      );
    }
    throw error;
  }
}

export async function getClients() {
  try {
    const response = await api.get<Client[]>("/clients");

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(
        errorData?.error ||
          errorData?.message ||
          errorData?.errors?.join(", ") ||
          "Failed to fetch clients"
      );
    }
    throw error;
  }
}

export async function getClientById(clientId: string) {
  try {
    const response = await api.get<Client>(`/clients/${clientId}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(
        errorData?.error ||
          errorData?.message ||
          errorData?.errors?.join(", ") ||
          "Failed to fetch client"
      );
    }
    throw error;
  }
}
export async function updateClient(clientId: string, data: ClientForm) {
  try {
    const response = await api.put<Client>(`/clients/${clientId}`, data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(
        errorData?.error ||
          errorData?.message ||
          errorData?.errors?.join(", ") ||
          "Failed to update client"
      );
    }
    throw error;
  }
}
export async function deleteClient(clientId: string) {
  try {
    await api.delete(`/clients/${clientId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(
        errorData?.error ||
          errorData?.message ||
          errorData?.errors?.join(", ") ||
          "Failed to delete client"
      );
    }
    throw error;
  }
}
