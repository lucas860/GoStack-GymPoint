module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('students', 'plano_id', {
      plano: {
        type: Sequelize.INTEGER,
        references: { model: 'planos', key: 'id', as: 'plano_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('students', 'plano_id');
  },
};
