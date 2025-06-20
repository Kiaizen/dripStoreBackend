const Category = require("../models/Category"); // modelo Sequelize da tabela categorias
const { Op } = require("sequelize");

const searchCategories = async (req, res) => {
  try {
    let { limit = 12, page = 1, fields, use_in_menu } = req.query;

    // Validar e converter
    limit = Number(limit);
    page = Number(page);

    if (isNaN(limit) || (limit !== -1 && limit <= 0)) {
      return res.status(400).json({ message: "Parâmetro limit inválido" });
    }
    if (isNaN(page) || page <= 0) {
      return res.status(400).json({ message: "Parâmetro page inválido" });
    }

    // Campos a serem selecionados
    let attributes;
    if (fields) {
      attributes = fields.split(",").map((f) => f.trim());
      // Sempre incluir id para identificar registros
      if (!attributes.includes("id")) {
        attributes.push("id");
      }
    }

    // Filtro use_in_menu
    const where = {};
    if (use_in_menu !== undefined) {
      if (use_in_menu === "true") where.use_in_menu = true;
      else if (use_in_menu === "false") where.use_in_menu = false;
      else
        return res
          .status(400)
          .json({ message: "Parâmetro use_in_menu inválido" });
    }

    // Contar total de categorias que atendem o filtro
    const total = await Category.count({ where });

    // Definir paginação
    let offset = 0;
    if (limit !== -1) {
      offset = (page - 1) * limit;
    }

    // Buscar categorias
    const categories = await Category.findAll({
      where,
      attributes,
      limit: limit === -1 ? undefined : limit,
      offset: limit === -1 ? undefined : offset,
      order: [["id", "ASC"]],
    });

    return res.status(200).json({
      data: categories,
      total,
      limit,
      page: limit === -1 ? 1 : page,
    });
  } catch (err) {
    console.error("Erro ao buscar categorias:", err);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    const { name, slug, use_in_menu } = category;
    return res.status(200).json({ id: category.id, name, slug, use_in_menu });
  } catch (error) {
    console.error("Erro ao buscar categoria por ID:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};

const createCategory = async (req, res) => {
  const { name, slug, use_in_menu } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ message: 'Nome e slug são obrigatórios' });
  }

  try {
    const category = await Category.create({
      name,
      slug,
      use_in_menu: use_in_menu || false
    });

    return res.status(201).json({
      id: category.id,
      name: category.name,
      slug: category.slug,
      use_in_menu: category.use_in_menu
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return res.status(500).json({ message: 'Erro interno ao criar categoria' });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, slug, use_in_menu } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ message: 'Nome e slug são obrigatórios' });
  }

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    await category.update({ name, slug, use_in_menu });

    return res.status(204).send(); // Nenhum corpo de resposta
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    await category.destroy();

    return res.status(204).send(); // Nenhum corpo de resposta
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

module.exports = {
  searchCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
