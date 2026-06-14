package com.weatherflow.app.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.weatherflow.app.ui.favorites.FavoritesScreen
import com.weatherflow.app.ui.favorites.FavoritesViewModel
import com.weatherflow.app.ui.home.HomeScreen
import com.weatherflow.app.ui.home.HomeViewModel
import com.weatherflow.app.ui.search.SearchScreen
import com.weatherflow.app.ui.search.SearchViewModel
import com.weatherflow.app.ui.settings.SettingsScreen
import com.weatherflow.app.ui.settings.SettingsViewModel
import org.koin.androidx.compose.koinViewModel
import org.koin.core.parameter.parametersOf

object Routes {
    const val HOME = "home"
    const val SEARCH = "search"
    const val FAVORITES = "favorites"
    const val SETTINGS = "settings"
}

@Composable
fun NavGraph() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = Routes.HOME) {
        composable(Routes.HOME) {
            val viewModel = koinViewModel<HomeViewModel>()
            HomeScreen(
                viewModel = viewModel,
                onSettingsClick = { navController.navigate(Routes.SETTINGS) },
            )
        }
        composable(Routes.SEARCH) {
            val viewModel = koinViewModel<SearchViewModel>()
            SearchScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() },
                onCitySelected = { navController.popBackStack() },
            )
        }
        composable(Routes.FAVORITES) {
            val viewModel = koinViewModel<FavoritesViewModel>()
            FavoritesScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() },
            )
        }
        composable(Routes.SETTINGS) {
            val viewModel = koinViewModel<SettingsViewModel>()
            SettingsScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() },
            )
        }
    }
}
