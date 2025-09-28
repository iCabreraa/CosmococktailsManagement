import supabase from "./supabase";

/**
 * Obtener todos los clientes
 */
export async function getClients() {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading clients:", error);
      // Fallback: retornar array vacío si la tabla no existe
      if (
        error.code === "PGRST116" ||
        error.message.includes('relation "clients" does not exist')
      ) {
        console.log("📦 Tabla clients no existe, retornando array vacío");
        return [];
      }
      throw new Error("Clients could not be loaded");
    }

    return data || [];
  } catch (err) {
    console.error("Error in getClients:", err);
    // Fallback: retornar array vacío en caso de error
    return [];
  }
}

/**
 * Obtener un cliente por ID
 */
export async function getClientById(id) {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error loading client:", error);
    throw new Error("Client not found");
  }

  return data;
}

/**
 * Obtener clientes por email
 */
export async function getClientByEmail(email) {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error loading client by email:", error);
    throw new Error("Client not found");
  }

  return data;
}

/**
 * Crear o actualizar cliente
 */
export async function createOrUpdateClient(clientData) {
  const { data, error } = await supabase
    .from("clients")
    .upsert(clientData, {
      onConflict: "email",
      ignoreDuplicates: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving client:", error);
    throw new Error("Client could not be saved");
  }

  return data;
}

/**
 * Eliminar cliente
 */
export async function deleteClient(id) {
  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) {
    console.error("Error deleting client:", error);
    throw new Error("Client could not be deleted");
  }
}

/**
 * Obtener estadísticas de clientes
 */
export async function getClientStats() {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("is_guest, created_at");

    if (error) {
      console.error("Error loading client stats:", error);
      // Fallback: retornar estadísticas vacías si la tabla no existe
      if (
        error.code === "PGRST116" ||
        error.message.includes('relation "clients" does not exist')
      ) {
        console.log(
          "📦 Tabla clients no existe, retornando estadísticas vacías"
        );
        return {
          totalClients: 0,
          guestClients: 0,
          registeredClients: 0,
          recentClients: 0,
        };
      }
      throw new Error("Client stats could not be loaded");
    }

    const totalClients = data?.length || 0;
    const guestClients = data?.filter(c => c.is_guest).length || 0;
    const registeredClients = totalClients - guestClients;

    // Clientes por mes (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentClients =
      data?.filter(c => new Date(c.created_at) >= sixMonthsAgo).length || 0;

    return {
      totalClients,
      guestClients,
      registeredClients,
      recentClients,
    };
  } catch (err) {
    console.error("Error in getClientStats:", err);
    // Fallback: retornar estadísticas vacías en caso de error
    return {
      totalClients: 0,
      guestClients: 0,
      registeredClients: 0,
      recentClients: 0,
    };
  }
}
