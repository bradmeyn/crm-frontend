import { api, type ApiError } from "@services/api";
import axios from "axios";
import { NewClientForm } from "./schemas";
import { Client } from "./types";

export async function createClient(data: NewClientForm) {
  try {
    const response = await api.post<Client>("/clients/", data);

    return response.data;
  } catch (error) {
    console.error("Error creating client:", error);
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      console.error("API error data:", errorData);
    }
    throw error;
  }
}

export async function getClients(params?: {
  page?: number;
  pageSize?: number;
  q?: string;
}) {
  try {
    // The API currently returns all clients for the current business.
    // We accept page/pageSize here for future server-side pagination support and include q as a query param.
    const response = await api.get<Client[]>("/clients/", {
      params: {
        q: params?.q,
        // page and pageSize can be sent when server-side paging is implemented
        page: params?.page,
        pageSize: params?.pageSize,
      },
    });

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
    const response = await api.get<Client>(`/clients/${clientId}/`);

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

export async function updateClient(clientId: string, data: NewClientForm) {
  try {
    const response = await api.put<Client>(`/clients/${clientId}/`, data);

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
    await api.delete(`/clients/${clientId}/`);
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
