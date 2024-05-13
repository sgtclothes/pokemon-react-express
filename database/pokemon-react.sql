-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 13, 2024 at 02:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pokemon-react`
--

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `log_id` int(11) NOT NULL,
  `log_type` varchar(255) DEFAULT NULL,
  `log_name` varchar(255) DEFAULT NULL,
  `log_description` varchar(255) DEFAULT NULL,
  `log_active` tinyint(1) DEFAULT NULL,
  `log_created_by` int(11) DEFAULT NULL,
  `log_updated_by` int(11) DEFAULT NULL,
  `log_created_on` datetime DEFAULT NULL,
  `log_updated_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20211231024945-createUsersTable.js'),
('20240512144838-createUserPokemonsTable.js'),
('20240512154856-createTokensTable.js'),
('20240512154922-createLogsTable.js');

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `tkn_id` int(11) NOT NULL,
  `tkn_type` varchar(255) DEFAULT NULL,
  `tkn_value` text DEFAULT NULL,
  `tkn_description` varchar(255) DEFAULT NULL,
  `tkn_client_ip` varchar(255) DEFAULT NULL,
  `tkn_client_agent` varchar(255) DEFAULT NULL,
  `tkn_us_id` int(11) DEFAULT NULL,
  `tkn_expired_on` datetime DEFAULT NULL,
  `tkn_active` tinyint(1) DEFAULT NULL,
  `tkn_created_by` int(11) DEFAULT NULL,
  `tkn_updated_by` int(11) DEFAULT NULL,
  `tkn_created_on` datetime DEFAULT NULL,
  `tkn_updated_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`tkn_id`, `tkn_type`, `tkn_value`, `tkn_description`, `tkn_client_ip`, `tkn_client_agent`, `tkn_us_id`, `tkn_expired_on`, `tkn_active`, `tkn_created_by`, `tkn_updated_by`, `tkn_created_on`, `tkn_updated_on`) VALUES
(1, 'LOGIN', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c19pZCI6MSwidXNfdXNlcm5hbWUiOiJzaWdpdCIsInVzX2VtYWlsIjoic2lrby5zcGFkZTMxQGdtYWlsLmNvbSIsInN0YXR1cyI6InN1Y2Nlc3MiLCJtZXNzYWdlIjoidXNlciBsb2dnZWQgaW4iLCJwYXRoIjoiLyIsImlhdCI6MTcxNTYwMTEzNiwiZXhwIjoxNzE1Njg3NTM2fQ.IWfBltP9MR2ZXgiXHdj6sWAES8URNcZt0LVCXDOOBZE', 'Login user to Pokemon React Application', '36.81.90.255', 'Node/20.13.0 (Windows_NT 10.0.19045; win32; x64)', 1, '2024-05-14 11:52:16', 0, 1, NULL, '2024-05-13 11:52:16', NULL),
(2, 'LOGIN', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c19pZCI6MSwidXNfdXNlcm5hbWUiOiJzaWdpdCIsInVzX2VtYWlsIjoic2lrby5zcGFkZTMxQGdtYWlsLmNvbSIsInN0YXR1cyI6InN1Y2Nlc3MiLCJtZXNzYWdlIjoidXNlciBsb2dnZWQgaW4iLCJwYXRoIjoiLyIsImlhdCI6MTcxNTYwMTE0OSwiZXhwIjoxNzE1Njg3NTQ5fQ.7HgHn6o_5_-pbOaceqaDE98Yx2ywU3wL_PrCsjU58ro', 'Login user to Pokemon React Application', '36.81.90.255', 'Node/20.13.0 (Windows_NT 10.0.19045; win32; x64)', 1, '2024-05-14 11:52:30', 0, 1, NULL, '2024-05-13 11:52:30', NULL),
(3, 'LOGIN', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c19pZCI6MSwidXNfdXNlcm5hbWUiOiJzaWdpdCIsInVzX2VtYWlsIjoic2lrby5zcGFkZTMxQGdtYWlsLmNvbSIsInN0YXR1cyI6InN1Y2Nlc3MiLCJtZXNzYWdlIjoidXNlciBsb2dnZWQgaW4iLCJwYXRoIjoiLyIsImlhdCI6MTcxNTYwMTI5NCwiZXhwIjoxNzE1Njg3Njk0fQ.3KIMXn6cCVC3ap5bJQ4k9sCxh4s4Uv8XUuYAKDed6Rw', 'Login user to Pokemon React Application', '36.81.90.255', 'Node/20.13.0 (Windows_NT 10.0.19045; win32; x64)', 1, '2024-05-14 11:54:54', 0, 1, NULL, '2024-05-13 11:54:54', NULL),
(4, 'LOGIN', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c19pZCI6MSwidXNfdXNlcm5hbWUiOiJzaWdpdCIsInVzX2VtYWlsIjoic2lrby5zcGFkZTMxQGdtYWlsLmNvbSIsInN0YXR1cyI6InN1Y2Nlc3MiLCJtZXNzYWdlIjoidXNlciBsb2dnZWQgaW4iLCJwYXRoIjoiLyIsImlhdCI6MTcxNTYwMTI5OSwiZXhwIjoxNzE1Njg3Njk5fQ.LShzIsVYWQHG2P16aBvHzZ_tCVcGgLmUi1ZeqXj3LYg', 'Login user to Pokemon React Application', '36.81.90.255', 'Node/20.13.0 (Windows_NT 10.0.19045; win32; x64)', 1, '2024-05-14 11:54:59', 0, 1, NULL, '2024-05-13 11:54:59', NULL),
(5, 'LOGIN', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c19pZCI6MSwidXNfdXNlcm5hbWUiOiJzaWdpdCIsInVzX2VtYWlsIjoic2lrby5zcGFkZTMxQGdtYWlsLmNvbSIsInN0YXR1cyI6InN1Y2Nlc3MiLCJtZXNzYWdlIjoidXNlciBsb2dnZWQgaW4iLCJwYXRoIjoiLyIsImlhdCI6MTcxNTYwMTQ5MiwiZXhwIjoxNzE1Njg3ODkyfQ.moGY2EcC5okYUzmNvbIoJclNyLZlmLKmb9IbDccc0kg', 'Login user to Pokemon React Application', '36.81.90.255', 'Node/20.13.0 (Windows_NT 10.0.19045; win32; x64)', 1, '2024-05-14 11:58:13', 0, 1, NULL, '2024-05-13 11:58:13', NULL),
(6, 'LOGIN', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c19pZCI6MSwidXNfdXNlcm5hbWUiOiJzaWdpdCIsInVzX2VtYWlsIjoic2lrby5zcGFkZTMxQGdtYWlsLmNvbSIsInN0YXR1cyI6InN1Y2Nlc3MiLCJtZXNzYWdlIjoidXNlciBsb2dnZWQgaW4iLCJwYXRoIjoiLyIsImlhdCI6MTcxNTYwMTUwNywiZXhwIjoxNzE1Njg3OTA3fQ.gyBk9G5yam85ZVZGmqPOOhONsi29icTlZuadwfnAX-s', 'Login user to Pokemon React Application', '36.81.90.255', 'Node/20.13.0 (Windows_NT 10.0.19045; win32; x64)', 1, '2024-05-14 11:58:28', 0, 1, NULL, '2024-05-13 11:58:28', NULL),
(7, 'LOGIN', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c19pZCI6MSwidXNfdXNlcm5hbWUiOiJzaWdpdCIsInVzX2VtYWlsIjoic2lrby5zcGFkZTMxQGdtYWlsLmNvbSIsInN0YXR1cyI6InN1Y2Nlc3MiLCJtZXNzYWdlIjoidXNlciBsb2dnZWQgaW4iLCJwYXRoIjoiLyIsImlhdCI6MTcxNTYwMTYxNiwiZXhwIjoxNzE1Njg4MDE2fQ._cM0cEBr_7fRH0CP4t3owxom6No43yD515s1RUqLFI0', 'Login user to Pokemon React Application', '36.81.90.255', 'Node/20.13.0 (Windows_NT 10.0.19045; win32; x64)', 1, '2024-05-14 12:00:17', 0, 1, NULL, '2024-05-13 12:00:17', NULL),
(8, 'LOGIN', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c19pZCI6MSwidXNfdXNlcm5hbWUiOiJzaWdpdCIsInVzX2VtYWlsIjoic2lrby5zcGFkZTMxQGdtYWlsLmNvbSIsInN0YXR1cyI6InN1Y2Nlc3MiLCJtZXNzYWdlIjoidXNlciBsb2dnZWQgaW4iLCJwYXRoIjoiLyIsImlhdCI6MTcxNTYwMTk1MCwiZXhwIjoxNzE1Njg4MzUwfQ.uysPFmdZpOV6OxZhIytNFJnZYONRcaozhhgwN1cv9ac', 'Login user to Pokemon React Application', '36.81.90.255', 'Node/20.13.0 (Windows_NT 10.0.19045; win32; x64)', 1, '2024-05-14 12:05:51', 0, 1, NULL, '2024-05-13 12:05:51', NULL),
(9, 'LOGIN', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c19pZCI6MSwidXNfdXNlcm5hbWUiOiJzaWdpdCIsInVzX2VtYWlsIjoic2lrby5zcGFkZTMxQGdtYWlsLmNvbSIsInN0YXR1cyI6InN1Y2Nlc3MiLCJtZXNzYWdlIjoidXNlciBsb2dnZWQgaW4iLCJwYXRoIjoiLyIsImlhdCI6MTcxNTYwMTk1OCwiZXhwIjoxNzE1Njg4MzU4fQ.zSx-nZ-uQo8CZcHg_zEi4gayKdLfbZo34dcMkus7OOg', 'Login user to Pokemon React Application', '36.81.90.255', 'Node/20.13.0 (Windows_NT 10.0.19045; win32; x64)', 1, '2024-05-14 12:05:58', 0, 1, NULL, '2024-05-13 12:05:58', NULL),
(10, 'LOGIN', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c19pZCI6MSwidXNfdXNlcm5hbWUiOiJzaWdpdCIsInVzX2VtYWlsIjoic2lrby5zcGFkZTMxQGdtYWlsLmNvbSIsInN0YXR1cyI6InN1Y2Nlc3MiLCJtZXNzYWdlIjoidXNlciBsb2dnZWQgaW4iLCJwYXRoIjoiLyIsImlhdCI6MTcxNTYwMjAwMiwiZXhwIjoxNzE1Njg4NDAyfQ.lfrM7YfU6vEdIGZErKUiNkoMIjk2tjUZIv4xthsKQd4', 'Login user to Pokemon React Application', '36.81.90.255', 'Node/20.13.0 (Windows_NT 10.0.19045; win32; x64)', 1, '2024-05-14 12:06:42', 0, 1, NULL, '2024-05-13 12:06:42', NULL),
(11, 'LOGIN', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c19pZCI6MSwidXNfdXNlcm5hbWUiOiJzaWdpdCIsInVzX2VtYWlsIjoic2lrby5zcGFkZTMxQGdtYWlsLmNvbSIsInN0YXR1cyI6InN1Y2Nlc3MiLCJtZXNzYWdlIjoidXNlciBsb2dnZWQgaW4iLCJwYXRoIjoiLyIsImlhdCI6MTcxNTYwMzE3MSwiZXhwIjoxNzE1Njg5NTcxfQ.ICdsWdEKZb-bTqF2s-zw_Iawa68gDFHomNVRBfIgUwE', 'Login user to Pokemon React Application', '36.81.90.255', 'Node/20.13.0 (Windows_NT 10.0.19045; win32; x64)', 1, '2024-05-14 12:26:13', 1, 1, NULL, '2024-05-13 12:26:13', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `us_id` int(11) NOT NULL,
  `us_username` varchar(255) DEFAULT NULL,
  `us_password` varchar(255) DEFAULT NULL,
  `us_email` varchar(255) DEFAULT NULL,
  `us_register` tinyint(1) DEFAULT NULL,
  `us_active` tinyint(1) DEFAULT NULL,
  `us_created_by` int(11) DEFAULT NULL,
  `us_updated_by` int(11) DEFAULT NULL,
  `us_created_on` datetime DEFAULT NULL,
  `us_updated_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`us_id`, `us_username`, `us_password`, `us_email`, `us_register`, `us_active`, `us_created_by`, `us_updated_by`, `us_created_on`, `us_updated_on`) VALUES
(1, 'sigit', '$2a$08$bXkRSokblgy/nG4y2AEREe5vns7GoC.b50hpOL2Qa4JXNRKFDgCTS', 'siko.spade31@gmail.com', 1, 1, NULL, NULL, '2024-05-13 10:56:58', NULL),
(2, 'phincon', '$2a$08$bXkRSokblgy/nG4y2AEREe5vns7GoC.b50hpOL2Qa4JXNRKFDgCTS', 'phincon@gmail.com', 1, 1, NULL, NULL, '2024-05-13 10:56:58', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users_pokemons`
--

CREATE TABLE `users_pokemons` (
  `up_id` int(11) NOT NULL,
  `up_us_id` int(11) DEFAULT NULL,
  `up_pk_api_id` int(11) DEFAULT NULL,
  `up_pk_name` varchar(255) DEFAULT NULL,
  `up_pk_nickname` varchar(255) DEFAULT NULL,
  `up_active` tinyint(1) DEFAULT NULL,
  `up_created_by` int(11) DEFAULT NULL,
  `up_updated_by` int(11) DEFAULT NULL,
  `up_created_on` datetime DEFAULT NULL,
  `up_updated_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_pokemons`
--

INSERT INTO `users_pokemons` (`up_id`, `up_us_id`, `up_pk_api_id`, `up_pk_name`, `up_pk_nickname`, `up_active`, `up_created_by`, `up_updated_by`, `up_created_on`, `up_updated_on`) VALUES
(1, 1, 1, 'bulbasaur', 'mighty bulbasaur', 0, NULL, NULL, '2024-05-13 10:56:58', NULL),
(2, 1, 2, 'ivysaur', 'mighty ivysaur', 0, NULL, NULL, '2024-05-13 10:56:58', NULL),
(3, 2, 1, 'bulbasaur', 'fhgfhf-0', 1, NULL, NULL, '2024-05-13 10:56:58', NULL),
(4, 1, 12, 'butterfree', 'okeh-1', 0, 1, NULL, '2024-05-13 11:05:06', NULL),
(5, 1, 3, 'venusaur', 'mgjm-55', 1, 1, NULL, '2024-05-13 11:56:07', NULL),
(6, 1, 4, 'charmander', 'gfdgdf-3', 1, 1, NULL, '2024-05-13 12:11:53', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`tkn_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`us_id`),
  ADD UNIQUE KEY `us_username` (`us_username`),
  ADD UNIQUE KEY `us_email` (`us_email`);

--
-- Indexes for table `users_pokemons`
--
ALTER TABLE `users_pokemons`
  ADD PRIMARY KEY (`up_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `tkn_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `us_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users_pokemons`
--
ALTER TABLE `users_pokemons`
  MODIFY `up_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
