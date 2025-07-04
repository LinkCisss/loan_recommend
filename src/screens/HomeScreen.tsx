import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ChatFloatingButton from '../components/ChatFloatingButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface HomeScreenProps {
  phoneNumber: string;
}

type RootStackParamList = {
  Chat: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC<HomeScreenProps> = ({ phoneNumber }) => {
  const mockUserData = {
    name: '张先生',
    creditScore: 720,
    availableAmount: 50000,
    recommendedLoans: [
      {
        id: 1,
        name: '个人消费贷款',
        amount: '5-20万',
        rate: '4.35%',
        period: '12-36个月',
        icon: 'card',
        color: '#667eea',
      },
      {
        id: 2,
        name: '信用贷款',
        amount: '1-10万',
        rate: '5.88%',
        period: '6-24个月',
        icon: 'trending-up',
        color: '#764ba2',
      },
      {
        id: 3,
        name: '抵押贷款',
        amount: '10-100万',
        rate: '3.85%',
        period: '12-60个月',
        icon: 'home',
        color: '#f093fb',
      },
    ],
  };

  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollView}>
        {/* 头部用户信息 */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
        >
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={30} color="white" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{mockUserData.name}</Text>
              <Text style={styles.userPhone}>{phoneNumber}</Text>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.creditInfo}>
            <Text style={styles.creditLabel}>信用评分</Text>
            <Text style={styles.creditScore}>{mockUserData.creditScore}</Text>
            <Text style={styles.creditStatus}>优秀</Text>
          </View>
        </LinearGradient>

        {/* 快速操作 */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#667eea' }]}>
              <Ionicons name="add-circle" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>申请贷款</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#764ba2' }]}>
              <Ionicons name="calculator" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>贷款计算</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#f093fb' }]}>
              <Ionicons name="document-text" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>我的申请</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#4facfe' }]}>
              <Ionicons name="help-circle" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>帮助中心</Text>
          </TouchableOpacity>
        </View>

        {/* 推荐贷款 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI推荐贷款</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>查看全部</Text>
            </TouchableOpacity>
          </View>

          {mockUserData.recommendedLoans.map((loan) => (
            <TouchableOpacity key={loan.id} style={styles.loanCard}>
              <View style={styles.loanHeader}>
                <View style={[styles.loanIcon, { backgroundColor: loan.color }]}>
                  <Ionicons name={loan.icon as any} size={20} color="white" />
                </View>
                <View style={styles.loanInfo}>
                  <Text style={styles.loanName}>{loan.name}</Text>
                  <Text style={styles.loanAmount}>额度：{loan.amount}</Text>
                </View>
                <TouchableOpacity style={styles.applyButton}>
                  <Text style={styles.applyButtonText}>立即申请</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.loanDetails}>
                <View style={styles.loanDetail}>
                  <Text style={styles.detailLabel}>年利率</Text>
                  <Text style={styles.detailValue}>{loan.rate}</Text>
                </View>
                <View style={styles.loanDetail}>
                  <Text style={styles.detailLabel}>期限</Text>
                  <Text style={styles.detailValue}>{loan.period}</Text>
                </View>
                <View style={styles.loanDetail}>
                  <Text style={styles.detailLabel}>放款速度</Text>
                  <Text style={styles.detailValue}>1-3天</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 最新动态 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>最新动态</Text>
          <View style={styles.newsCard}>
            <Text style={styles.newsTitle}>央行降息，贷款利率下调</Text>
            <Text style={styles.newsContent}>
              中国人民银行宣布下调基准利率，各银行纷纷跟进调整贷款利率...
            </Text>
            <Text style={styles.newsTime}>2小时前</Text>
          </View>
        </View>
      </ScrollView>
      <ChatFloatingButton onPress={() => navigation.navigate('Chat')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  settingsButton: {
    padding: 8,
  },
  creditInfo: {
    alignItems: 'center',
  },
  creditLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  creditScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  creditStatus: {
    fontSize: 16,
    color: '#4ade80',
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#667eea',
  },
  loanCard: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  loanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  loanIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  loanInfo: {
    flex: 1,
  },
  loanName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  loanAmount: {
    fontSize: 14,
    color: '#666',
  },
  applyButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loanDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loanDetail: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  newsCard: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    padding: 15,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  newsContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  newsTime: {
    fontSize: 12,
    color: '#999',
  },
});

export default HomeScreen; 