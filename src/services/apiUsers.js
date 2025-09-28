import supabase from "./supabase";

// Obtener todos los usuarios con paginación y filtros
export async function getUsers(filters = {}) {
  try {
    const { page = 1, limit = 10, role, status, search } = filters;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("users_new")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1);

    // Aplicar filtros
    if (role) query = query.eq("role", role);
    if (status) query = query.eq("status", status);
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error loading users:", error);
      throw new Error("Users could not be loaded");
    }

    return {
      users: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  } catch (err) {
    console.error("Error in getUsers:", err);
    return {
      users: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    };
  }
}

// Obtener usuario por ID
export async function getUserById(id) {
  try {
    const { data, error } = await supabase
      .from("users_new")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error loading user:", error);
      throw new Error("User could not be loaded");
    }

    return data;
  } catch (err) {
    console.error("Error in getUserById:", err);
    return null;
  }
}

// Crear nuevo usuario
export async function createUser(userData) {
  try {
    const { data, error } = await supabase
      .from("users_new")
      .insert([userData])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      throw new Error("User could not be created");
    }

    return data;
  } catch (err) {
    console.error("Error in createUser:", err);
    throw err;
  }
}

// Actualizar usuario
export async function updateUser(id, updates) {
  try {
    const { data, error } = await supabase
      .from("users_new")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      throw new Error("User could not be updated");
    }

    return data;
  } catch (err) {
    console.error("Error in updateUser:", err);
    throw err;
  }
}

// Actualizar rol de usuario
export async function updateUserRole(id, role) {
  try {
    const { data, error } = await supabase
      .from("users_new")
      .update({
        role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user role:", error);
      throw new Error("User role could not be updated");
    }

    return data;
  } catch (err) {
    console.error("Error in updateUserRole:", err);
    throw err;
  }
}

// Eliminar usuario
export async function deleteUser(id) {
  try {
    const { error } = await supabase.from("users_new").delete().eq("id", id);

    if (error) {
      console.error("Error deleting user:", error);
      throw new Error("User could not be deleted");
    }

    return true;
  } catch (err) {
    console.error("Error in deleteUser:", err);
    throw err;
  }
}

// Obtener estadísticas de usuarios
export async function getUserStats() {
  try {
    const { data, error } = await supabase
      .from("users_new")
      .select("role, status, created_at");

    if (error) {
      console.error("Error loading user stats:", error);
      return {
        total: 0,
        byRole: {},
        byStatus: {},
        recent: 0,
      };
    }

    const total = data?.length || 0;

    const byRole =
      data?.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {}) || {};

    const byStatus =
      data?.reduce((acc, user) => {
        acc[user.status] = (acc[user.status] || 0) + 1;
        return acc;
      }, {}) || {};

    // Usuarios creados en los últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recent =
      data?.filter(user => new Date(user.created_at) >= thirtyDaysAgo).length ||
      0;

    return {
      total,
      byRole,
      byStatus,
      recent,
    };
  } catch (err) {
    console.error("Error in getUserStats:", err);
    return {
      total: 0,
      byRole: {},
      byStatus: {},
      recent: 0,
    };
  }
}
