export default {
    isAdmin: (state) => state.user.abilities.indexOf('*') !== -1,
    fullName: (state) => `${state.user.f_name} ${state.user.l_name}`,
}
